import Link from "next/link";
import { LEGAL_CONTACT } from "@/lib/legal-content";

const UPDATED_AT = "13.04.2026";

export default function TermsPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Общие условия оказания услуг</h1>
            <div className="text-base leading-7 text-[#1F2A37]/90">
              <p className="font-semibold">Версия: 1.0</p>
              <p>Дата обновления: {UPDATED_AT}</p>
              <p className="mt-4">
                Важно: настоящая русскоязычная версия документа предоставлена для удобства пользователей. В
                случае расхождений между языковыми версиями приоритет имеет французская версия документа.
              </p>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">1. Предмет</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Настоящие Общие условия оказания услуг определяют условия, на которых Dmitrii OLEINIK, предприниматель,
            осуществляющий деятельность под брендом AzurSysTech, оказывает клиентам IT-услуги, в том числе:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• локальную IT-помощь</li>
            <li>• установку и настройку рабочих мест</li>
            <li>• настройку новых компьютеров</li>
            <li>• помощь с Wi-Fi и локальной сетью</li>
            <li>• установку и настройку принтеров</li>
            <li>• выездные IT-интервенции</li>
            <li>• иные лёгкие IT-услуги, описанные в смете, акте выезда, письменной переписке или счёте-фактуре</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Настоящие условия в первую очередь применяются к частным клиентам. Они также могут применяться к
            профессиональным клиентам, если иное не согласовано письменно.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">2. Данные исполнителя</h2>
          <dl className="grid gap-3 text-[#1F2A37]/90">
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Имя и фамилия</dt>
              <dd className="font-medium">Dmitrii OLEINIK</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Статус</dt>
              <dd>Entrepreneur individuel – micro-entrepreneur</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">SIREN</dt>
              <dd>940 870 140</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">SIRET</dt>
              <dd>940 870 140 00016</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">APE / NAF</dt>
              <dd>6201Z – Programmation informatique</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Профессиональный адрес</dt>
              <dd>9 AV EMMANUEL BRIDAULT, 06000 NICE, France</dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Email</dt>
              <dd>
                <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>
                  {LEGAL_CONTACT.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Телефон</dt>
              <dd>
                <a className="font-medium text-[#1F6F78] underline" href={LEGAL_CONTACT.phoneHref}>
                  {LEGAL_CONTACT.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">WhatsApp</dt>
              <dd>
                <a className="font-medium text-[#8A4A2F] underline" href={LEGAL_CONTACT.whatsappHref}>
                  {LEGAL_CONTACT.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#1F2A37]/70">Сайт</dt>
              <dd>azursystech.fr</dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">3. Зона оказания услуг</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech оказывает услуги преимущественно в Ницце и в радиусе примерно 30 км вокруг Ниццы, если
            иное отдельно не согласовано.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">4. Характер услуг</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Услуги могут оказываться:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• на месте у клиента</li>
            <li>• дистанционно</li>
            <li>• либо в смешанном формате, в зависимости от характера запроса</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Услуги AzurSysTech представляют собой помощь, настройку, установку, диагностику или ввод в
            эксплуатацию.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Если иное прямо и письменно не согласовано, AzurSysTech не гарантирует:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• абсолютную совместимость оборудования или программного обеспечения третьих лиц</li>
            <li>• доступность сервисов или оборудования, предоставляемых третьими лицами</li>
            <li>• немедленное устранение всех неисправностей</li>
            <li>• возможность выполнить любой запрос, не входящий в первоначально согласованный объём</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">5. Смета и заключение договора</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            В зависимости от характера услуги AzurSysTech может работать:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• на основании сметы (devis), принятой клиентом</li>
            <li>• на основании простого письменного согласования (email, сообщение, WhatsApp, форма сайта, письменное подтверждение)</li>
            <li>• либо на основании разового запроса с последующей интервенцией и выставлением счёта</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Смета (devis) рекомендуется или требуется, в частности, если:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• услуга является сложной или нестандартной</li>
            <li>• затрагивает несколько устройств или рабочих мест</li>
            <li>• предполагает несколько этапов</li>
            <li>• требует закупок, материалов или специального выезда</li>
            <li>• профессиональный клиент запрашивает предварительное подтверждение условий</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Договор считается заключённым с момента принятия сметы либо, при её отсутствии, с момента ясного
            письменного подтверждения услуги, её объёма и принципа ценообразования.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">6. Стоимость услуг</h2>
          <p className="leading-7 text-[#1F2A37]/90">Цены указываются в евро.</p>
          <p className="leading-7 text-[#1F2A37]/90">
            Если не указано иное, цены, размещённые на сайте, являются ориентировочными ценами «от».
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Окончательная стоимость зависит, в частности, от:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• точного характера услуги</li>
            <li>• количества устройств или рабочих мест</li>
            <li>• технической сложности</li>
            <li>• времени интервенции</li>
            <li>• необходимости выезда</li>
            <li>• дополнительных потребностей, выявленных после диагностики</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Любые работы, не входившие в первоначальный объём, подлежат отдельному согласованию до их выполнения.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">7. Аванс</h2>
          <p className="leading-7 text-[#1F2A37]/90">AzurSysTech вправе запросить аванс, в частности, если:</p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• под задачу резервируется конкретный слот</li>
            <li>• работа предполагает несколько этапов</li>
            <li>• требуется закупка или подготовка материалов</li>
            <li>• клиент является профессионалом</li>
            <li>• риск отмены или неоплаты это оправдывает</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Размер аванса указывается в смете или в соответствующем письменном согласовании.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">8. Способы оплаты</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech может принимать оплату следующими способами:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• по ссылке на оплату</li>
            <li>• банковской картой, если этот способ доступен</li>
            <li>• банковским переводом</li>
            <li>• мгновенным переводом</li>
            <li>• наличными в пределах, допускаемых законом</li>
            <li>• иным способом, прямо принятым AzurSysTech</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            Для частных клиентов, если не согласовано иное, оплата производится в день интервенции или по
            получении счёта-фактуры.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Для профессиональных клиентов, если не согласовано иное, оплата производится по получении
            счёта-фактуры либо в соответствии с условиями, указанными в смете или счёте.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">9. Счёт-фактура</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Счёт-фактура выставляется в соответствии с характером услуги и статусом клиента.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Для профессиональных клиентов счёт-фактура выставляется в обязательном порядке в соответствии с
            применимыми правилами.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Для частных клиентов счёт-фактура может выдаваться по запросу или в случаях, когда она требуется.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Если micro-entreprise не является плательщиком НДС, в счёте-фактуре может указываться соответствующая
            обязательная пометка о применении режима освобождения от НДС.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">10. Просрочка оплаты</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            В случае просрочки оплаты со стороны профессионального клиента могут применяться штрафы за просрочку
            в соответствии с условиями, указанными в счёте-фактуре или смете.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            В соответствии с применимым правом, с профессионального клиента также может взыскиваться фиксированная
            компенсация расходов на взыскание, если это указано в договорных и платёжных документах.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">11. Порядок выполнения услуг</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech выполняет услуги добросовестно и с должной заботливостью, в рамках обязанности по средствам,
            а не обязанности по гарантированному результату, если иное прямо и письменно не согласовано.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">Клиент обязуется:</p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• предоставлять точную информацию</li>
            <li>• по возможности корректно описывать задачу</li>
            <li>• обеспечить доступ к оборудованию, программам, учётным записям или помещениям, необходимым для выполнения работ</li>
            <li>• по возможности сделать резервную копию данных до начала интервенции</li>
            <li>• сообщить о технических или организационных ограничениях, которые могут повлиять на выполнение работ</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">12. Резервное копирование и данные</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Если иное не согласовано письменно, клиент самостоятельно отвечает за предварительное резервное
            копирование своих данных.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech не несёт ответственности за потерю, повреждение или недоступность данных, если:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• клиент не выполнил резервное копирование</li>
            <li>• проблема была вызвана уже существующим дефектом</li>
            <li>• ущерб вызван оборудованием, программным обеспечением или сервисами третьих лиц</li>
            <li>• либо возник по причине, не зависящей от AzurSysTech</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">13. Выезд, отмена и перенос</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            О любой отмене или переносе согласованного визита клиент должен сообщить как можно раньше.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech вправе удержать аванс полностью или частично либо выставить оплату, если:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• клиент отменил слишком поздно</li>
            <li>• выезд уже был начат</li>
            <li>• под клиента был специально зарезервирован слот</li>
            <li>• к моменту отмены уже были понесены расходы</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            В случае уважительных обстоятельств стороны стараются согласовать новую дату.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">14. Право на отказ — для частных клиентов</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Если договор заключён дистанционно или вне офиса с клиентом-потребителем, такой клиент в принципе
            имеет 14 дней на отказ с момента заключения договора, если не применяется законное исключение.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Если клиент желает, чтобы выполнение услуги началось до истечения этого срока, он должен прямо
            выразить такое желание.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Если услуга была полностью исполнена до окончания срока на отказ при наличии:
          </p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• предварительного явного согласия клиента</li>
            <li>• и подтверждения клиента, что он осознаёт утрату права на отказ после полного исполнения</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            При необходимости образец заявления об отказе может быть предоставлен клиенту отдельно или включён
            в договорный пакет.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">15. Ограничение ответственности</h2>
          <p className="leading-7 text-[#1F2A37]/90">AzurSysTech не несёт ответственности за:</p>
          <ul className="grid gap-2 text-[#1F2A37]/90">
            <li>• неисправности, вызванные оборудованием, программным обеспечением, сетью, интернет-доступом или сервисами третьих лиц</li>
            <li>• ненормальное или неправильное использование оборудования клиентом</li>
            <li>• несовместимость, которую невозможно выявить без дополнительных тестов</li>
            <li>• усложнение интервенции из-за неточной или неполной информации клиента</li>
            <li>• косвенный ущерб, если иное не установлено обязательными нормами закона</li>
          </ul>
          <p className="leading-7 text-[#1F2A37]/90">
            В любом случае ответственность AzurSysTech не может превышать сумму, фактически уплаченную клиентом
            за соответствующую услугу, кроме случаев грубой вины, умысла или прямого законного исключения.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">16. Интеллектуальная собственность</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Документы, тексты, визуальные элементы, методики, материалы и иные результаты, предоставляемые или
            публикуемые AzurSysTech, охраняются нормами применимого права об интеллектуальной собственности.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Любое воспроизведение, распространение или повторное использование без предварительного письменного
            разрешения запрещено, кроме случаев, прямо допускаемых законом.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">17. Персональные данные</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Персональные данные обрабатываются в соответствии с{" "}
            <Link className="font-medium text-[#1F6F78] underline" href="/privacy">
              Политикой конфиденциальности
            </Link>
            , размещённой на сайте azursystech.fr.
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">18. Претензии</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            Любая претензия должна в первую очередь направляться в письменной форме по адресу:{" "}
            <a className="font-medium text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>
              {LEGAL_CONTACT.email}
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
          <h2 className="font-serif text-2xl">19. Применимое право и компетентный суд</h2>
          <p className="leading-7 text-[#1F2A37]/90">Настоящие условия регулируются правом Франции.</p>
          <p className="leading-7 text-[#1F2A37]/90">
            В случае спора с клиентом-потребителем сохраняются обязательные правила подсудности, применимые к
            потребителю.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            В случае спора с профессиональным клиентом, при отсутствии мирного урегулирования, компетентным
            является суд, определяемый по общим правилам права, если иное не предусмотрено действительным
            письменным соглашением.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">20. Изменение условий</h2>
          <p className="leading-7 text-[#1F2A37]/90">
            AzurSysTech вправе изменять настоящие Общие условия в любое время.
          </p>
          <p className="leading-7 text-[#1F2A37]/90">
            Применимой является версия, действовавшая на дату заключения договора, принятия сметы или иного
            письменного согласования услуги.
          </p>
        </section>
      </div>
    </main>
  );
}
