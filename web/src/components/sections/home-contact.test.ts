import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HomeContactSection } from "./home-contact";

describe("HomeContactSection English contract", () => {
  it("renders the English contact form with the required language choice", () => {
    const markup = renderToStaticMarkup(createElement(HomeContactSection, { locale: "en" }));

    expect(markup).toContain("Tell us what you need in plain language");
    expect(markup).toContain('name="preferred_contact_language"');
    expect(markup).toContain("Choose a language");
    expect(markup).toContain('<option value="ru">Русский</option>');
    expect(markup).toContain('<option value="fr">Français</option>');
    expect(markup).toContain('<option value="en">English</option>');
    expect(markup).not.toMatch(/<option value="(?:ru|fr|en)" selected="">/);
    expect(markup).toContain('name="service_type"');
    expect(markup).toContain('value="automatisation_ia"');
    expect(markup).toContain('value="site_web"');
    expect(markup).toContain('value="site_automation_bundle"');
    expect(markup).toContain('value="autre"');
  });
});
