import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { REDUCED_MOTION_QUERY } from "../../lib/media";
import { reveal } from "../../lib/animations";
import ExternalLink from "../../components/ui/ExternalLink";
import {
  Accent,
  AnnotatedImage,
  Body,
  Bullets,
  Callout,
  Cards,
  CaseStudy,
  Columns,
  Options,
  Section,
  Split,
  Statement,
  Steps,
  Takeaways,
  WideImage,
} from "../../features/case-study";

// Assets

import cuaptsResults from "../../assets/case-studies/cuapts/results.mp4";
import cuaptsResultsPoster from "../../assets/optimized/cuapts-results-poster.webp";
import cuaptsBreakdown from "../../assets/optimized/cuapts-results-breakdown.webp";
import cuaptsAiPageV1 from "../../assets/optimized/cuapts-ai-page-v1.webp";
import cuaptsModeSwitch from "../../assets/case-studies/cuapts/mode-switch.mp4";
import cuaptsModeSwitchPoster from "../../assets/optimized/cuapts-mode-switch-poster.webp";
import cuaptsInlineQuotes from "../../assets/optimized/cuapts-inline-quotes.webp";
import cuaptsListingCards from "../../assets/optimized/cuapts-listing-cards.webp";
import cuaptsLofi from "../../assets/optimized/cuapts-lofi.webp";
import cuaptsGrid from "../../assets/optimized/cuapts-grid.webp";
import cuaptsTextAnswer from "../../assets/optimized/cuapts-text-answer.webp";
import cuaptsComposed from "../../assets/optimized/cuapts-answer-composed.webp";
import logoClaude from "../../assets/case-studies/cuapts/logos/claude.svg";
import logoChatgpt from "../../assets/case-studies/cuapts/logos/openai.svg";
import logoPerplexity from "../../assets/case-studies/cuapts/logos/perplexity.svg";
import logoGoogle from "../../assets/case-studies/cuapts/logos/google.svg";
import cuaptsCover from "../../assets/case-studies/cuapts/cover.mp4";
import cuaptsCoverPoster from "../../assets/optimized/cuapts-cover-poster.webp";
import cuaptsLogo from "../../assets/case-studies/cuapts/logo.svg?raw";

// Typewriter

const PROMPTS = [
  "4-person rentals close to West Campus",
  "Small studio apartment under $3000",
  "Cheapest studio near Statler",
  "2 bedroom in Collegetown under $1.5K",
];

const REDUCED_LINE_DELAY = 3200;
const TYPE_DELAY = 45;
const HOLD_DELAY = 2400;
const DELETE_DELAY = 22;
const NEXT_LINE_DELAY = 350;

function Prompts({ label }: { label: string }) {
  const [text, setText] = useState(PROMPTS[0]);
  const longest = PROMPTS.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (PROMPTS.length < 2) return;
    let line = 0;
    let length = PROMPTS[0].length;
    let deleting = false;
    let timer: number;
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const tick = () => {
      if (reduced) {
        line = (line + 1) % PROMPTS.length;
        setText(PROMPTS[line]);
        timer = window.setTimeout(tick, REDUCED_LINE_DELAY);
        return;
      }
      const full = PROMPTS[line];
      if (!deleting && length < full.length) {
        length += 1;
        setText(full.slice(0, length));
        timer = window.setTimeout(tick, TYPE_DELAY);
      } else if (!deleting) {
        deleting = true;
        timer = window.setTimeout(tick, HOLD_DELAY);
      } else if (length > 0) {
        length -= 1;
        setText(full.slice(0, length));
        timer = window.setTimeout(tick, DELETE_DELAY);
      } else {
        deleting = false;
        line = (line + 1) % PROMPTS.length;
        timer = window.setTimeout(tick, NEXT_LINE_DELAY);
      }
    };
    timer = window.setTimeout(tick, HOLD_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.aside
      className="study-callout"
      {...reveal(0.1)}
    >
      <p className="study-callout-label">{label}</p>
      <p
        className="study-callout-text study-prompts-text"
        aria-label={PROMPTS.join(" / ")}
      >
        <span
          className="study-prompts-sizer"
          aria-hidden="true"
        >
          {longest}
        </span>
        <span aria-hidden="true">
          {text}
          <span className="study-prompts-caret" />
        </span>
      </p>
    </motion.aside>
  );
}

// Page

export default function CuApts() {
  return (
    <CaseStudy
      slug="cuapts"
      title="CUApts"
      logoSvg={cuaptsLogo}
      subtitle="Helping college students navigate housing with AI"
      video={{ src: cuaptsCover, poster: cuaptsCoverPoster }}
      meta={[
        { label: "Team", lines: ["Cornell DTI · CUApts"] },
        { label: "Role", lines: ["Product Designer"] },
        { label: "Timeline", lines: ["Spring 2026"] },
        {
          label: "Tools & Skills",
          lines: ["Figma", "Market Research", "LLM UI/UX", ""],
        },
      ]}
    >
      <Section label="Overview">
        <Split aside={<Prompts label="Try asking:" />}>
          <Statement>
            Find your next place at Cornell, <Accent>described in your own words</Accent>.
          </Statement>
          <Body>
            <ExternalLink href="https://www.cuapts.org/">CUApts</ExternalLink> is a Cornell DTI product that helps students find off-campus housing by providing real reviews from other Cornellians. <br /><br />I designed the AI / LLM search bar. Users describe what they're looking for in their own words, and CUApts builds an informed answer around their request: deciding whether they'll find top picks, a budget comparison, or a neighborhood guide most relevant.
          </Body>
        </Split>
        <Statement>
          Problem: the housing search is <Accent>overwhelming</Accent>
        </Statement>
        <Body>
          College students who are looking for an apartment for the first time have endless options and factors to weigh, and navigating complex filters or searching apartment by address only makes it harder.
        </Body>
        <Callout
          label="Objective"
          text={<>How might we give users a way to easily navigate <Accent>complex preferences</Accent> and find apartments that meet their constraints?</>}
        />
      </Section>
      <Section label="Market research">
        <Statement>Learning from AI search products</Statement>
        <Body>
          Because LLM-incorporated search is a relatively new field without concrete UI/UX rules, I researched how current AI products help users navigate the novel technology and how they structure their responses.
        </Body>
        <Cards items={[
          {
            title: "Claude",
            logo: logoClaude,
            lines: [
              "One open field that lets users ask in plain language instead of using filters.",
            ],
          },
          {
            title: "ChatGPT",
            logo: logoChatgpt,
            lines: [
              "Example prompts under the input to help users understand how best to use the tool.",
            ],
          },
          {
            title: "Perplexity",
            logo: logoPerplexity,
            lines: [
              "Search modes switch inside the same input so users never leave the page.",
            ],
          },
        ]} />
        <Bullets
          title="What they have in common:"
          items={[
            "Focus on open-ended search",
            "Division into sections for improved readability rather than one long, unbroken response",
            "A glowing design motif to indicate the use of AI",
          ]}
        />
        <Steps
          title={<>User Flow Deep Dive: <Accent>Google</Accent> AI Mode</>}
          titleLogo={logoGoogle}
          items={[
            {
              title: "Enter",
              body: 'Open "AI Mode" from the default search bar and ask AI in a standard open-question format.',
            },
            {
              title: "Digest",
              body: "Response structured by category (overall top, budget, by neighborhood), including breakdowns on estimated price, location, and key features.",
            },
            {
              title: "Explore",
              body: "Links to Cornell and Ithaca websites for housing.",
            },
          ]}
        />
      </Section>
      <Section label="Ideation">
        <Statement>Putting market research findings into practice</Statement>
        <AnnotatedImage
          src={cuaptsLofi}
          alt="Lo-fi sketches of the current page, the AI search entry point and the expanded AI search"
          cards={[
            {
              title: "Search bar",
              lines: [
                'Glowing outline motif (common for AI interfaces) with rotating suggestions like "studio near campus under $900".',
              ],
            },
            {
              title: "Filter chips",
              lines: [
                "Generated based on the user's prompts after the search is run. I decided not to use these because users can apply filters themselves, so the feature does not add much value.",
              ],
            },
            {
              title: "Results",
              lines: [
                "Cards taken from the current design system, with an option to sort.",
              ],
            },
          ]}
        />
      </Section>
      <Section label="Iteration">
        <Statement>Refining the user flow</Statement>
        <Options items={[
          {
            src: cuaptsAiPageV1,
            chosen: false,
            title: "Separate AI page",
            pros: ["A dedicated space for AI search"],
            cons: [
              "Having AI and normal search pages is redundant and might confuse users",
              "Harder to return to manual search",
            ],
          },
          {
            src: cuaptsModeSwitch,
            poster: cuaptsModeSwitchPoster,
            chosen: true,
            title: "Same-page mode switch",
            pros: [
              'Kept the "Search with AI" button (standard among AI search)',
              "The button changes the header, so users stay on the same page",
              "One click back to manual search",
            ],
            cons: [],
          },
        ]} />
      </Section>
      <Section label="Key decision">
        <Statement>
          How should <Accent>AI search</Accent> differ from normal search?
        </Statement>
        <Options items={[
          {
            src: cuaptsGrid,
            chosen: false,
            title: "Grid of listing cards",
            pros: ["Familiar and easy to browse"],
            cons: [
              "Identical to normal search",
              "Doesn't explain reasoning behind the results",
            ],
          },
          {
            src: cuaptsTextAnswer,
            chosen: false,
            title: "Plain-text answer",
            pros: ["Explains budget and location considerations"],
            cons: [
              "Hard to scan + compare",
              "Disconnected from real listings",
            ],
          },
          {
            src: cuaptsComposed,
            chosen: true,
            title: "Modular, component-based system",
            pros: [
              "Visually different from normal search",
              "Shows listings in the context of the user's constraints",
              "Combination of text and components makes scanning easy while still providing reasoning",
            ],
            cons: [],
          },
        ]} />
      </Section>
      <Section label="SOLUTION">
        <Statement>Let AI build the answer</Statement>
        <Columns items={[
          {
            title: <>Problem: <Accent>Unhelpful Results</Accent></>,
            body: "Students search with a set of constraints (roommates, distance to campus, budget), but a plain list of results doesn't show which ones each apartment meets.",
          },
          {
            title: <>Solution: <Accent>Component Library</Accent></>,
            body: "Instead of auto-applying filters, the LLM builds each answer from a library of components, picking the ones that best explain the results, so it's clear how each apartment fits what the user asked for.",
          },
        ]} />
        <Cards items={[
          {
            title: "Listing cards",
            image: cuaptsListingCards,
            lines: [
              <><Accent>Which places match?</Accent> Top picks, using the same cards users already see when browsing.</>,
            ],
          },
          {
            title: "Accordion table",
            image: cuaptsBreakdown,
            lines: [
              <><Accent>How do they compare?</Accent> Price + key features shown side by side. Each row expands to show the listing and a relevant review.</>,
            ],
          },
          {
            title: "Inline quotes",
            image: cuaptsInlineQuotes,
            lines: [
              <><Accent>Where should I live?</Accent> A breakdown of each neighborhood, with a link to narrow the search.</>,
            ],
          },
        ]} />
        <Callout
          label="Built to Scale"
          text="New CUApts features can easily be added to the set of components the AI uses to build its answers, making the feature scalable as the platform grows."
        />
      </Section>
      <Section
        label="Final design"
        showcase
      >
        <WideImage
          src={cuaptsResults}
          poster={cuaptsResultsPoster}
          alt="AI search results for 4-person rentals close to West Campus"
          caption=""
        />
      </Section>
      <Section label="Takeaways">
        <Statement>What I learned</Statement>
        <Takeaways
          grid
          items={[
            {
              title: <>Exploring an <Accent>emergent</Accent> field in design</>,
              body: "UX for AI/LLM is a relatively new space without as many set conventions. I enjoyed learning about the patterns that are starting to emerge through market research and how to incorporate innovation in a way that's easy for users to understand.",
            },
            {
              title: <>Designing <Accent>with</Accent> developers</>,
              body: "Handoff involved documenting the component system and user flow in detail to communicate my vision as accurately as possible. Working closely with developers to balance design with feasibility, I gained a better understanding of how design and programming come together in a product environment.",
            },
          ]}
        />
      </Section>
    </CaseStudy>
  );
}
