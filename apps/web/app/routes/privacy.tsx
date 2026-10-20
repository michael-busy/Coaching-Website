import type { Route } from "./+types/privacy";
import { CONTACT_EMAIL, SITE_URL, mailto } from "~/lib/site";

export const meta: Route.MetaFunction = () => [
  {
    title: "Privacy Policy — Chernyakov Coaching",
  },
  {
    name: "description",
    content:
      "Privacy policy (Datenschutzerklärung) for chernyakov-coaching.com — what data is processed, why, and your rights under the GDPR.",
  },
  {
    name: "robots",
    content: "index, follow",
  },
  {
    tagName: "link",
    rel: "canonical",
    href: `${SITE_URL}/privacy/`,
  },
];

export default function Privacy() {
  return (
    <>
      <section className="hero [border-top:none] pb-6">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="lead max-w-[720px]">
            Datenschutzerklärung for chernyakov-coaching.com. This page explains what personal data
            is processed when you visit this website, on what legal basis, and what rights you have.
          </p>
          <p className="text-muted-foreground text-[0.9rem]">
            Last updated: <span id="policy-date">8 August 2026</span>
          </p>
        </div>
      </section>

      <section className="[border-top:none] pt-4">
        <div className="container">
          <div className="legal-body">
            <h2>1. Controller</h2>
            <p>
              The controller responsible for data processing on this website within the meaning of
              the General Data Protection Regulation (GDPR) is:
            </p>
            <p>
              Michael Chernyakov
              <br />
              <em>[Street address]</em>
              <br />
              <em>[Postal code, City]</em>
              <br />
              Germany
              <br />
              Email: <a href={mailto()}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              The controller is the natural or legal person who alone or jointly with others
              determines the purposes and means of the processing of personal data.
            </p>

            <h2>2. General notes on data processing</h2>
            <p>
              I take the protection of your personal data seriously and treat it confidentially and
              in accordance with statutory data protection regulations and this privacy policy.
            </p>
            <p>
              Please note that data transmitted over the internet can in principle have security
              gaps. Complete protection of data against access by third parties is not possible.
            </p>
            <p>
              This website uses SSL/TLS encryption for security reasons and to protect the
              transmission of confidential content. You can recognise an encrypted connection by the
              address bar showing <strong>https://</strong> and the lock icon in your browser.
            </p>

            <h2>3. Hosting</h2>
            <p>
              This website and its server functions are hosted by <strong>Cloudflare</strong>{" "}
              (Cloudflare Workers), a service of Cloudflare, Inc., 101 Townsend St, San Francisco,
              CA 94107, USA. Cloudflare also provides the DNS for this domain.
            </p>
            <p>
              When you visit this website, Cloudflare automatically processes information that your
              browser transmits in order to deliver the website. This may include:
            </p>
            <ul>
              <li>IP address of the requesting device</li>
              <li>Date and time of the request</li>
              <li>Name and URL of the file requested</li>
              <li>Referrer URL (the page from which you arrived)</li>
              <li>Browser type and version, and operating system</li>
            </ul>
            <p>
              This data is processed for the purpose of enabling the delivery of the website,
              ensuring system security and stability, and preventing misuse. The legal basis is Art.
              6(1)(f) GDPR (legitimate interest in the technically error-free presentation and
              optimisation of the website).
            </p>
            <p>
              Cloudflare is based in the USA. Data transfers to the USA are based on the EU Standard
              Contractual Clauses and Cloudflare's certification under the EU–U.S. Data Privacy
              Framework. Further information:{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloudflare Privacy Policy
              </a>
              .
            </p>

            <h2>4. Web analytics — Umami</h2>
            <p>
              This website uses <strong>Umami</strong>, a privacy-focused web analytics service
              provided by Umami Software, Inc. Data for this website is processed on servers located
              in the <strong>European Union</strong>.
            </p>
            <p>
              Umami is used to understand how this website is used — for example, how many people
              visit, which pages they read, and which sites they arrive from. This helps me improve
              the content and structure of the website.
            </p>
            <p>
              <strong>Umami does not use cookies</strong> and does not store any information on your
              device. It does not track you across websites or across sessions, and it does not
              create user profiles.
            </p>
            <p>The following non-identifying information is collected:</p>
            <ul>
              <li>Page URL visited and page title</li>
              <li>Referrer (the website you arrived from)</li>
              <li>Browser type, operating system and device type</li>
              <li>Screen size</li>
              <li>Country of origin</li>
            </ul>
            <p>
              Your IP address is <strong>not stored</strong>. It is used only transiently and in
              hashed form to distinguish one visit from another within a single day, after which it
              cannot be reversed or linked back to you. No personal data within the meaning of the
              GDPR is retained.
            </p>
            <p>
              The legal basis for this processing is Art. 6(1)(f) GDPR. My legitimate interest lies
              in the statistical analysis of visitor behaviour in order to optimise this website.
              Because no information is stored on or read from your device, no consent under § 25(1)
              TDDDG (formerly TTDSG) is required.
            </p>
            <p>
              Further information:{" "}
              <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer">
                Umami Privacy Policy
              </a>
              .
            </p>

            <h2>5. Appointment booking — Google Calendar</h2>
            <p>
              To book a coaching session or discovery call, this website links to an appointment
              booking page provided by <strong>Google Ireland Limited</strong>, Gordon House, Barrow
              Street, Dublin 4, Ireland.
            </p>
            <p>
              The booking form is not embedded in this website — you are directed to a page operated
              by Google. Any data you enter there (such as your name, email address and chosen
              appointment time) is processed by Google and transmitted to me for the purpose of
              scheduling and conducting the appointment.
            </p>
            <p>
              The legal basis is Art. 6(1)(b) GDPR (performance of a contract or pre-contractual
              measures) where the booking relates to coaching services, and otherwise Art. 6(1)(f)
              GDPR. Google's own data processing is governed by its privacy policy:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/privacy
              </a>
              .
            </p>

            <h2>6. Bot protection — Cloudflare Turnstile</h2>
            <p>
              To protect the download form against spam and automated abuse, this website uses{" "}
              <strong>Cloudflare Turnstile</strong>, a service of Cloudflare, Inc. (address above).
              Turnstile is only loaded on the pages with the download form. It checks whether a
              request comes from a human by evaluating technical information about your browser and
              device, such as your IP address and browser characteristics. Turnstile does not use
              cookies for advertising or tracking.
            </p>
            <p>
              The legal basis is Art. 6(1)(f) GDPR (legitimate interest in protecting the signup
              form and the mailing list from abuse). Further information:{" "}
              <a
                href="https://www.cloudflare.com/turnstile-privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloudflare Turnstile Privacy Addendum
              </a>
              .
            </p>
            <p>
              Fonts on this website are hosted on the same server as the website itself; no
              connection to third-party font services is made.
            </p>

            <h2>7. Contact by email</h2>
            <p>
              If you contact me by email, the details you provide — including your email address,
              your name, and the content of your message — will be stored for the purpose of
              processing your enquiry and in case of follow-up questions.
            </p>
            <p>
              The legal basis is Art. 6(1)(b) GDPR where your enquiry relates to a contract or
              pre-contractual measures, and otherwise Art. 6(1)(f) GDPR (legitimate interest in
              responding to enquiries). This data will not be passed on without your consent, and
              will be deleted once your enquiry has been dealt with and no statutory retention
              obligations apply.
            </p>

            <h2>8. Free downloads and offers (MailerLite)</h2>
            <p>
              The free resources on this website (worksheets and workbooks) can be downloaded after
              entering your email address. To manage these email addresses I use{" "}
              <strong>MailerLite</strong>, a service of UAB "MailerLite", Paupio st. 46, Vilnius,
              Lithuania. Subscriber data is stored on servers within the European Union. A data
              processing agreement is in place with MailerLite.
            </p>
            <p>
              <strong>Download (email required).</strong> When you request a download, the email
              address you enter is sent to this website's server, which passes it to MailerLite. It
              is stored together with the resource you downloaded and the date and time of the
              download, and the download starts straight away. You will not receive any marketing
              emails on this basis. The legal basis is Art. 6(1)(b) GDPR (providing the resource you
              requested). This data is stored for <em>[retention period, e.g. 24 months]</em> after
              your last download, unless you ask me to delete it earlier.
            </p>
            <p>
              <strong>Offers (optional).</strong> Separately, you can tick a box to receive offers,
              new resources and occasional invitations to book a call or join a course by email.
              This box is not ticked in advance, and declining it does not prevent you from
              downloading the resource. If you tick it, the <strong>double opt-in</strong> procedure
              applies: you will receive an email asking you to confirm, and only once you click the
              confirmation link will you receive offers. The legal basis is your consent under Art.
              6(1)(a) GDPR.
            </p>
            <p>
              To evidence your consent, the following is stored with your email address: your IP
              address at the time of the request, the date and time of your consent and of your
              confirmation, and the version of the consent text you agreed to.
            </p>
            <p>
              <strong>You can withdraw your consent at any time</strong> — for example by clicking
              the unsubscribe link at the bottom of every email, or by emailing me. Withdrawal does
              not affect the lawfulness of processing carried out before withdrawal. After you
              unsubscribe, you will no longer receive offers.
            </p>
            <p>
              MailerLite analyses whether emails are opened and which links are clicked, in order to
              understand which content is useful. Further information:{" "}
              <a
                href="https://www.mailerlite.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                MailerLite Privacy Policy
              </a>
              .
            </p>

            <h2>9. Confidentiality of coaching content</h2>
            <p>
              Information shared with me during coaching sessions is treated as strictly
              confidential. As a coach working to the International Coaching Federation (ICF) Code
              of Ethics, I do not disclose the content of sessions to third parties without your
              explicit consent, except where disclosure is required by law.
            </p>

            <h2>10. Your rights</h2>
            <p>Under the GDPR you have the following rights in relation to your personal data:</p>
            <ul>
              <li>
                <strong>Right of access</strong> (Art. 15 GDPR) — to obtain confirmation as to
                whether data concerning you is processed, and to receive a copy
              </li>
              <li>
                <strong>Right to rectification</strong> (Art. 16 GDPR) — to have inaccurate data
                corrected
              </li>
              <li>
                <strong>Right to erasure</strong> (Art. 17 GDPR) — to have your data deleted
              </li>
              <li>
                <strong>Right to restriction of processing</strong> (Art. 18 GDPR)
              </li>
              <li>
                <strong>Right to data portability</strong> (Art. 20 GDPR) — to receive your data in
                a machine-readable format
              </li>
              <li>
                <strong>Right to object</strong> (Art. 21 GDPR) — to object to processing based on
                legitimate interest
              </li>
              <li>
                <strong>Right to withdraw consent</strong> (Art. 7(3) GDPR) — at any time, with
                effect for the future
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact me at <a href={mailto()}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>11. Right to lodge a complaint</h2>
            <p>
              If you believe that the processing of your personal data infringes the GDPR, you have
              the right to lodge a complaint with a supervisory authority — in particular in the
              Member State of your habitual residence, place of work, or the place of the alleged
              infringement.
            </p>
            <p>
              The competent supervisory authority for Berlin is the Berliner Beauftragte für
              Datenschutz und Informationsfreiheit,{" "}
              <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener noreferrer">
                datenschutz-berlin.de
              </a>
              .
            </p>

            <h2>12. Changes to this privacy policy</h2>
            <p>
              This privacy policy may be updated to reflect changes to this website or to legal
              requirements. The version published on this page at the time of your visit applies.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
