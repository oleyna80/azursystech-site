import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CONTACT_PHONE = '+33 7 80 72 09 94';
const CONTACT_PHONE_HREF = 'tel:+33780720994';
const WHATSAPP_HREF = 'https://wa.me/33780720994';
const MAX_INPUT_LENGTH = 1000;
const MAX_RENDERED_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 6;

const sanitizeMessageContent = (content) => {
  if (typeof content !== 'string') {
    return '';
  }

  return content
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .slice(0, MAX_RENDERED_MESSAGE_LENGTH);
};

export default function ChatWidget({ locale, t }) {
  const initialAssistantMessage = { role: 'assistant', content: t('chat.welcome') };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatErrorKey, setChatErrorKey] = useState('');
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [handoffSubmitted, setHandoffSubmitted] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [handoffErrorKey, setHandoffErrorKey] = useState('');
  const [handoffForm, setHandoffForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    segment: '',
    serviceType: '',
  });
  const messagesEndRef = useRef(null);
  const contactCopy = t('contact');
  const contactFormCopy = t('contact.form');
  const hasUserMessages = messages.some((msg) => msg.role === 'user');
  const canOpenHandoff = hasUserMessages || Boolean(chatErrorKey);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContactForm = () => {
    setIsOpen(false);
    setIsHandoffOpen(false);
    window.location.href = '/contact';
  };

  const buildChatSummary = () => {
    const userMessages = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => sanitizeMessageContent(msg.content))
      .filter(Boolean);

    return userMessages.join('\n').slice(0, 1500);
  };

  const buildRequestHistory = () => {
    const welcomeMessage = sanitizeMessageContent(t('chat.welcome'));

    return messages
      .map((msg) => ({
        role: msg?.role === 'user' ? 'user' : msg?.role === 'assistant' ? 'assistant' : '',
        content: sanitizeMessageContent(msg?.content),
      }))
      .filter((msg) => (msg.role === 'user' || msg.role === 'assistant') && Boolean(msg.content))
      .filter((msg, index) => !(index === 0 && msg.role === 'assistant' && msg.content === welcomeMessage))
      .slice(-MAX_HISTORY_ITEMS);
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleExternalOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('azursystech:open-chat', handleExternalOpen);

    return () => {
      window.removeEventListener('azursystech:open-chat', handleExternalOpen);
    };
  }, []);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chat.welcome') }]);
    setInput('');
    setIsLoading(false);
    setChatErrorKey('');
    setIsHandoffOpen(false);
    setHandoffSubmitted(false);
    setHandoffLoading(false);
    setHandoffErrorKey('');
    setHandoffForm({
      name: '',
      phone: '',
      email: '',
      city: '',
      segment: '',
      serviceType: '',
    });
  }, [locale, t]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || trimmedInput.length > MAX_INPUT_LENGTH) return;

    const userMsg = sanitizeMessageContent(trimmedInput).slice(0, MAX_INPUT_LENGTH);
    const history = buildRequestHistory();
    setInput('');
    setChatErrorKey('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history, locale })
      });

      if (res.status === 429) {
        setChatErrorKey('tooManyRequests');
        setMessages(prev => [...prev, { role: 'assistant', content: t('chat.tooManyRequests') }]);
        return;
      }

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();
      const safeReply = sanitizeMessageContent(data.reply || data.message || '...');
      setChatErrorKey('');
      setMessages(prev => [...prev, { role: 'assistant', content: safeReply || '...' }]);
    } catch {
      setChatErrorKey('unavailable');
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.unavailable') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHandoffSubmit = async (e) => {
    e.preventDefault();

    if (handoffLoading) {
      return;
    }

    setHandoffErrorKey('');
    setHandoffLoading(true);

    const chatSummary = buildChatSummary();
    const formData = new FormData();
    formData.set('name', handoffForm.name.trim());
    formData.set('phone', handoffForm.phone.trim());
    formData.set('city', handoffForm.city.trim());
    formData.set('segment', handoffForm.segment);
    formData.set('service_type', handoffForm.serviceType);
    formData.set(
      'problem_description',
      chatSummary || `Заявка из чат-виджета: ${handoffForm.serviceType}.`,
    );
    formData.set('source', 'website_chat');
    formData.set('website', '');

    if (handoffForm.email.trim()) {
      formData.set('email', handoffForm.email.trim());
    }

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        body: formData,
      });

      let result = null;
      try {
        result = await res.json();
      } catch {
        result = null;
      }

      if (res.status === 429) {
        setHandoffErrorKey('tooManyRequests');
        return;
      }

      if (result?.status === 'success') {
        setHandoffSubmitted(true);
        return;
      }

      if (result?.status === 'validation_error') {
        setHandoffErrorKey('submitError');
        return;
      }

      if (!res.ok) {
        setHandoffErrorKey('submitError');
        return;
      }
    } catch {
      setHandoffErrorKey('networkError');
    } finally {
      setHandoffLoading(false);
    }
  };

  const wrapUpCall = () => {
    setIsHandoffOpen(true);
    setHandoffSubmitted(false);
    setHandoffErrorKey('');
  };

  const renderFallbackActions = ({ variant = 'chat', errorKey = '' } = {}) => (
    <div className="rounded-xl border border-graphite/10 bg-base/60 p-3 space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-bold text-graphite">{t(variant === 'handoff' ? 'chat.handoffFallbackTitle' : 'chat.fallbackTitle')}</p>
        <p className="text-[11px] leading-relaxed text-graphite/70 font-medium">
          {variant === 'handoff'
            ? errorKey === 'tooManyRequests'
              ? t('chat.handoffFallbackTooManyRequests')
              : t('chat.handoffFallbackUnavailable')
            : chatErrorKey === 'tooManyRequests'
              ? t('chat.fallbackTooManyRequests')
              : t('chat.fallbackUnavailable')}
        </p>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={scrollToContactForm}
          className="w-full py-2.5 text-xs font-bold text-accent-teal bg-accent-teal/5 hover:bg-accent-teal/10 rounded-lg transition-colors"
        >
          {t('chat.contactFormCta')}
        </button>
        <a
          href={CONTACT_PHONE_HREF}
          className="w-full py-2.5 px-3 text-center text-xs font-bold text-graphite bg-surface border border-graphite/10 hover:border-graphite/20 rounded-lg transition-colors"
        >
          {t('chat.phoneCta')}: {CONTACT_PHONE}
        </a>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 text-center text-xs font-bold text-graphite bg-surface border border-graphite/10 hover:border-graphite/20 rounded-lg transition-colors"
        >
          {t('chat.whatsappCta')}
        </a>
      </div>
    </div>
  );

  const handleHandoffChange = (key) => (e) => {
    setHandoffForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          aria-label={t('chat.openButtonAriaLabel')}
          className="w-14 h-14 rounded-full bg-surface border border-graphite/10 text-accent-teal shadow-premium-soft flex items-center justify-center transition-all transform hover:-translate-y-1 hover:bg-white"
        >
          <span className="text-sm font-bold">AI</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] max-h-[600px] h-[80vh] flex flex-col bg-surface rounded-2xl shadow-premium-soft border border-graphite/10 overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center p-4 border-b border-graphite/5 bg-base/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
            <span className="text-xs font-bold">AI</span>
          </div>
          <span className="font-bold text-graphite text-sm">{isHandoffOpen ? t('contact.form.title') : t('chat.title')}</span>
        </div>
        <button aria-label={t('chat.closeButtonAriaLabel')} onClick={() => setIsOpen(false)} className="text-graphite/50 hover:text-graphite transition-colors">
          <span className="text-lg leading-none">x</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isHandoffOpen ? (
          handoffSubmitted ? (
            <div className="h-full flex flex-col justify-center text-center gap-4">
              <h3 className="text-lg font-bold text-graphite">{t('contact.successTitle')}</h3>
              <p className="text-sm text-graphite/70 font-medium">{t('contact.successText')}</p>
              <button
                type="button"
                onClick={scrollToContactForm}
                className="w-full py-2.5 text-sm font-bold text-accent-teal bg-accent-teal/5 hover:bg-accent-teal/10 rounded-lg transition-colors"
              >
                {t('chat.contactSectionCta')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleHandoffSubmit} className="space-y-3">
              <p className="text-xs text-graphite/70 font-medium">{contactFormCopy.intro}</p>

              {hasUserMessages && (
                <p className="text-[11px] text-graphite/60 font-medium leading-relaxed">{t('chat.summaryIncluded')}</p>
              )}

              {handoffErrorKey && (
                <div className="p-3 bg-accent-terra/10 border border-accent-terra/20 rounded-xl text-accent-terra text-xs font-bold">
                  {contactFormCopy.errors[handoffErrorKey]}
                </div>
              )}

              {handoffErrorKey && renderFallbackActions({ variant: 'handoff', errorKey: handoffErrorKey })}

              <input
                type="text"
                required
                value={handoffForm.name}
                onChange={handleHandoffChange('name')}
                placeholder={contactFormCopy.placeholders.name}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              />
              <input
                type="tel"
                required
                value={handoffForm.phone}
                onChange={handleHandoffChange('phone')}
                placeholder={contactFormCopy.placeholders.phone}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              />
              <input
                type="email"
                value={handoffForm.email}
                onChange={handleHandoffChange('email')}
                placeholder={contactFormCopy.placeholders.email}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              />
              <input
                type="text"
                required
                value={handoffForm.city}
                onChange={handleHandoffChange('city')}
                placeholder={contactFormCopy.placeholders.city}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              />
              <select
                required
                value={handoffForm.segment}
                onChange={handleHandoffChange('segment')}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              >
                <option value="">{contactFormCopy.labels.segment}</option>
                <option value="particulier">{contactFormCopy.segmentOptions.particulier}</option>
                <option value="tpe">{contactFormCopy.segmentOptions.tpe}</option>
              </select>
              <select
                required
                value={handoffForm.serviceType}
                onChange={handleHandoffChange('serviceType')}
                className="w-full bg-surface border border-graphite/10 rounded-xl px-4 py-2.5 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              >
                {contactFormCopy.serviceOptions.map((option) => (
                  <option key={option.value || 'empty'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  disabled={handoffLoading}
                  className="w-full py-2.5 bg-accent-teal hover:bg-accent-teal/90 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {handoffLoading ? contactFormCopy.submitLoading : contactFormCopy.submitIdle}
                </button>
                <button
                  type="button"
                  onClick={scrollToContactForm}
                  className="w-full py-2.5 text-xs font-bold text-accent-teal bg-accent-teal/5 hover:bg-accent-teal/10 rounded-lg transition-colors"
                >
                  {t('chat.contactSectionCta')}
                </button>

                <div className="text-[11px] text-graphite/60 font-medium leading-relaxed">
                  <a href={CONTACT_PHONE_HREF} className="text-accent-teal hover:underline">{contactCopy.phoneLabel}: {CONTACT_PHONE}</a>
                  <span className="mx-1">·</span>
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-accent-teal hover:underline">{contactCopy.whatsappLabel}</a>
                </div>
              </div>
            </form>
          )
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                  ? 'bg-accent-teal text-white rounded-br-none'
                  : 'bg-base border border-graphite/5 text-graphite/80 rounded-bl-none'
                  }`}>
                  {sanitizeMessageContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-base border border-graphite/5 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm text-graphite/50 flex items-center gap-1">
                  <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                </div>
              </div>
            )}
            {chatErrorKey && renderFallbackActions({ variant: 'chat', errorKey: chatErrorKey })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-graphite/5 bg-base/30">
        {!isHandoffOpen && (
          <>
            {canOpenHandoff && (
              <button
                onClick={wrapUpCall}
                className="w-full mb-3 flex items-center justify-center gap-1 py-2 text-xs font-bold text-accent-teal bg-accent-teal/5 hover:bg-accent-teal/10 rounded-lg transition-colors"
              >
                {t('chat.wrapUp')} <span aria-hidden="true">&gt;</span>
              </button>
            )}
            {hasUserMessages && !chatErrorKey && (
              <p className="mb-3 text-[11px] leading-relaxed text-graphite/60 font-medium">
                {t('chat.handoffHint')}
              </p>
            )}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                maxLength={MAX_INPUT_LENGTH}
                placeholder={t('chat.inputPlaceholder')}
                className="flex-1 bg-surface border border-graphite/10 rounded-xl px-4 py-2 text-sm text-graphite focus:outline-none focus:border-accent-teal"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || input.trim().length > MAX_INPUT_LENGTH}
                className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-accent-teal text-white rounded-xl disabled:opacity-50"
              >
                <span className="text-base font-bold">&gt;</span>
              </button>
            </form>
          </>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-graphite/50 font-medium">
          {t('chat.privacyNoticePrefix')}
          <Link href="/privacy" className="text-accent-teal hover:underline">{t('common.privacyPolicy')}</Link>
          {t('chat.privacyNoticeSuffix')}
        </p>
      </div>
    </div>
  );
}
