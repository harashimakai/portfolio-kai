import {
  Accent,
  AnnotatedImage,
  Body,
  Bullets,
  Callout,
  Cards,
  CaseStudy,
  Columns,
  Decision,
  FigureRow,
  ImageRow,
  Kicker,
  Options,
  Quotes,
  Section,
  Split,
  Statement,
  Stats,
  Steps,
  Takeaways,
  Video,
  WideImage,
} from "../../features/case-study";

// Placeholders

const placeholder = (label: string, width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="100%" height="100%" fill="#8a8d83" fill-opacity="0.16"/>` +
      `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#8a8d83" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="10 10"/>` +
      `<text x="50%" y="50%" fill="#8a8d83" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(width / 20)}" letter-spacing="3" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  )}`;

const phone = (label: string) => placeholder(label, 390, 844);
const landscape = (label: string) => placeholder(label, 1600, 1000);

const LOGO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
)}`;

// Page

export default function Template() {
  return (
    <CaseStudy
      slug="template"
      title="Case study template"
      subtitle="one-line description of the product / case study"
      video={{ src: "", poster: placeholder("HERO VIDEO", 1600, 900) }}
      meta={[
        { label: "Role", lines: ["Your title"] },
        { label: "Timeline", lines: ["e.g. 4 months"] },
        {
          label: "Team",
          lines: ["e.g. 2 designers", "3 engineers", "1 PM"],
        },
        {
          label: "Tools & Skills",
          lines: ["Figma", "User research", "Prototyping"],
        },
      ]}
      preview
    >
      <Section label="Overview">
        <Split aside={
          <Callout
            label="Try asking"
            text="An example of what a user might type"
          />
        }>
          <Statement>
            [Product name] is a [what it is] that helps <Accent>[who]</Accent> [do what].
          </Statement>
          <Body>
            Two or three sentences of context: the product, the team, and where your work fit in. Say what you owned, end to end, in plain words.
          </Body>
        </Split>
        <Callout
          label="The challenge"
          text={<>How might we <Accent>[outcome for users]</Accent> without <Accent>[the constraint that made it hard]</Accent>?</>}
        />
        <Stats items={[
          { value: "8", label: "User interviews" },
          { value: "40+", label: "Screens designed" },
          { value: "3", label: "Rounds of testing" },
        ]} />
      </Section>
      <Section label="Problem">
        <Statement>
          Problem: [what users want] keeps losing to <Accent>[what gets in the way]</Accent>.
        </Statement>
        <Body>
          Describe the tension, not the solution. Ground it in one concrete baseline if you have it — e.g. setup took 20+ clicks and 10 minutes on average.
        </Body>
        <Cards items={[
          {
            title: "Pain point one",
            lines: ["One sentence on what breaks and for whom."],
          },
          {
            title: "Pain point two",
            lines: ["One sentence on what breaks and for whom."],
          },
          {
            title: "Pain point three",
            lines: ["One sentence on what breaks and for whom."],
          },
        ]} />
      </Section>
      <Section label="Research">
        <Statement>Based on [method], here's what I found</Statement>
        <Stats items={[
          { value: "8", label: "1:1 interviews" },
          { value: "30+", label: "Survey responses" },
          { value: "3", label: "Competitors audited" },
        ]} />
        <Kicker>In their words</Kicker>
        <Quotes items={[
          "A real thing a participant said that captures the problem.",
          "A second quote that shows a different side of it.",
          "A third quote, ideally one that surprised you.",
        ]} />
        <Kicker>Key insights</Kicker>
        <Cards items={[
          {
            title: "Insight one",
            lines: ["A short claim, then one sentence of evidence."],
          },
          {
            title: "Insight two",
            lines: ["A short claim, then one sentence of evidence."],
          },
          {
            title: "Insight three",
            lines: ["A short claim, then one sentence of evidence."],
          },
        ]} />
        <Cards
          title="How [competitors] handle it"
          items={[
            {
              title: "Competitor A",
              logo: LOGO,
              lines: [
                <>One sentence on what they do, with <Accent>one key idea</Accent> you borrowed.</>,
              ],
            },
            {
              title: "Competitor B",
              logo: LOGO,
              lines: [
                <>One sentence on what they do, with <Accent>one key idea</Accent> you borrowed.</>,
              ],
            },
            {
              title: "Competitor C",
              logo: LOGO,
              lines: [
                <>One sentence on what they do, with <Accent>one key idea</Accent> you borrowed.</>,
              ],
            },
          ]}
        />
        <Steps
          title="Deep Dive: [one product's flow]"
          titleLogo={LOGO}
          items={[
            {
              title: "Enter",
              body: "Where the flow starts and what the user sees first.",
            },
            {
              title: "Digest",
              body: "How the response is structured and what stands out.",
            },
            { title: "Explore", body: "Where the user goes next." },
          ]}
        />
      </Section>
      <Section label="Process">
        <Statement>How I approached it</Statement>
        <Steps items={[
          {
            title: "Discover",
            body: "Interviews, surveys and a competitive audit to find where the experience breaks.",
          },
          {
            title: "Define",
            body: "Synthesized findings into insights and a single design question.",
          },
          {
            title: "Design",
            body: "Sketched, wireframed and prototyped options, then narrowed them down.",
          },
          {
            title: "Test",
            body: "Ran usability tests on each iteration and folded the feedback back in.",
          },
        ]} />
        <AnnotatedImage
          src={landscape("HERO MOCKUP")}
          alt="Placeholder wireframe"
          cards={[
            {
              title: "Note one",
              lines: ["What this part of the sketch shows."],
            },
            {
              title: "Note two",
              lines: ["What this part of the sketch shows."],
            },
            {
              title: "Note three",
              lines: ["What this part of the sketch shows."],
            },
          ]}
        />
      </Section>
      <Section label="Design decisions">
        <Statement>The decisions that shaped it</Statement>
        <Columns items={[
          {
            title: "Problem",
            body: "The tension in one or two sentences.",
          },
          {
            title: "Solution",
            body: "What you did about it, in one or two sentences.",
          },
        ]} />
        <Decision
          problem="What wasn't working, and the evidence that showed it."
          solution="What you changed, why it was the right trade-off, and what you gave up."
          src={landscape("DECISION 01")}
        />
        <Decision
          problem="What wasn't working, and the evidence that showed it."
          solution="What you changed, why it was the right trade-off, and what you gave up."
          src={landscape("DECISION 02")}
        />
        <Kicker>Options explored</Kicker>
        <Options items={[
          {
            src: landscape("OPTION A"),
            chosen: false,
            title: "Option A",
            pros: ["What it did well"],
            cons: ["Why it didn't work"],
          },
          {
            src: landscape("OPTION B"),
            chosen: false,
            title: "Option B",
            pros: ["What it did well"],
            cons: ["Why it didn't work", "A second drawback"],
          },
          {
            src: landscape("OPTION C"),
            chosen: true,
            title: "Option C",
            pros: ["Why this one won", "A second strength"],
            cons: [],
          },
        ]} />
        <Cards items={[
          {
            title: "Component one",
            image: landscape("DECISION 01"),
            lines: [
              <><Accent>What question it answers.</Accent> What it shows.</>,
            ],
          },
          {
            title: "Component two",
            image: landscape("DECISION 02"),
            lines: [
              <><Accent>What question it answers.</Accent> What it shows.</>,
            ],
          },
          {
            title: "Component three",
            image: landscape("OPTION A"),
            lines: [
              <><Accent>What question it answers.</Accent> What it shows.</>,
            ],
          },
        ]} />
      </Section>
      <Section label="Iteration">
        <Statement>[Screen name]: Iteration Process</Statement>
        <FigureRow
          sequence
          items={[
            {
              src: phone("SCREEN 1"),
              alt: "Screen, iteration 1",
              label: "Iteration 1",
              pros: [],
              cons: [],
            },
            {
              src: phone("SCREEN 2"),
              alt: "Screen, iteration 2",
              label: "Iteration 2",
              pros: [],
              cons: [],
            },
            {
              src: phone("SCREEN 3"),
              alt: "Screen, final",
              label: "Final prototype",
              pros: [],
              cons: [],
            },
          ]}
        />
        <Bullets
          title="Key changes"
          items={[
            "What changed between versions, and the feedback behind it",
            "A second change and why it mattered",
            "A third change and why it mattered",
          ]}
        />
      </Section>
      <Section label="Final design">
        <Statement>The final design</Statement>
        <WideImage
          src={landscape("HERO MOCKUP")}
          alt=""
          caption="Hero mockup"
        />
        <ImageRow items={[
          {
            src: landscape("DECISION 01"),
            alt: "",
            caption: "Detail one",
          },
          {
            src: landscape("DECISION 02"),
            alt: "",
            caption: "Detail two",
          },
        ]} />
        <FigureRow
          sequence={false}
          items={[
            {
              src: phone("SCREEN 1"),
              alt: "Screen one",
              label: "Screen name",
              pros: [],
              cons: [],
            },
            {
              src: phone("SCREEN 2"),
              alt: "Screen two",
              label: "Screen name",
              pros: [],
              cons: [],
            },
            {
              src: phone("SCREEN 3"),
              alt: "Screen three",
              label: "Screen name",
              pros: [],
              cons: [],
            },
          ]}
        />
        <Video
          src=""
          poster={landscape("VIDEO")}
          caption="Prototype walkthrough"
        />
      </Section>
      <Section label="Outcomes">
        <Statement>What happened after launch</Statement>
        <Stats items={[
          { value: "100k+", label: "Users reached" },
          { value: "−60%", label: "Time to complete setup" },
          { value: "4.8", label: "Average rating" },
        ]} />
        <Body>
          Pair each number with what it means. If it didn't ship, say so plainly — handed off, tested, or concept — and share the strongest evidence it works.
        </Body>
      </Section>
      <Section label="Reflection">
        <Takeaways items={[
          {
            title: <>A lesson, with one word in <Accent>accent</Accent></>,
            body: "What you learned and how it changed the way you work.",
          },
          {
            title: "A second lesson",
            body: "Specific to this project, not a generic design truth.",
          },
          {
            title: "A third lesson",
            body: "Optional: a skill you picked up or a tool you learned.",
          },
        ]} />
        <Callout
          label="If I had more time"
          text="What you'd do next, and what you'd change knowing what you know now."
        />
      </Section>
    </CaseStudy>
  );
}
