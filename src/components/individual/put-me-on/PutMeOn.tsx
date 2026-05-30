import { useEffect } from "react";
import { putmeon } from "../StudyData";
import backgroundCover from "../../../assets/case-studies/putmeon/gradient.png";
import CaseBand from "./CaseBand";
import CasePill from "./CasePill";
import pmo_wire1 from "../../../assets/case-studies/putmeon/wireframe1.jpg";
import pmo_wire2 from "../../../assets/case-studies/putmeon/wireframe2.jpg";
import CaseIntro from "./CaseIntro";
import CaseTriad from "./CaseTriad";
import pmo_home1 from "../../../assets/case-studies/putmeon/home1.png";
import pmo_home2 from "../../../assets/case-studies/putmeon/home2.png";
import pmo_home3 from "../../../assets/case-studies/putmeon/home3.png";
import pmo_account1 from "../../../assets/case-studies/putmeon/account1.png";
import pmo_account2 from "../../../assets/case-studies/putmeon/account2.png";
import pmo_account3 from "../../../assets/case-studies/putmeon/account3.png";
import pmo_library from "../../../assets/case-studies/putmeon/library.png";
import pmo_onboarding from "../../../assets/case-studies/putmeon/onboarding.png";
import CaseDouble from "./CaseDouble";
import CaseList from "./CaseList";
import CaseIterations from "./CaseIterations";
import CaseStack from "./CaseStack";
import CaseAccordion from "./CaseAccordion";

interface LogoProps {
  width: number;
  style?: object;
  itemUrl: string;
  title: string;
}

const personas = [
  {
    name: "ENJOYERS",
    bullets: [
      "Love music, but don't chase discovery",
      "Want a new favorite song without effort",
      "Trust their friends' taste more than playlists",
    ],
  },
  {
    name: "EXPLORERS",
    bullets: [
      "Want to diversify their taste",
      "Actively seek new genres and artists",
      "Feel like their recommendations are too algorithmic",
    ],
  },
  {
    name: "BOTH",
    bullets: [
      "Want to see what their friends are loving right now",
      "Discover music without having to search through extensive playlists",
      "Connect and stay in touch with friends through music",
    ],
  },
];

const quotes = [
  "Spotify's new design is part TikTok, part Instagram, and part YouTube",
  "Getting information overload just thinking about it",
  "I ******* hate the canvas feature. I WANT to see album cover art",
];

const home_iter = [pmo_home1, pmo_home2, pmo_home3];
const home_left = ["HOME · V1", "HOME · V2", "HOME · V3"];
const home_right = [
  "ITERATION 1",
  "ITERATION 2",
  <span className="case-accent">FINAL PROTOTYPE</span>,
];

const account_iter = [pmo_account1, pmo_account2, pmo_account3];
const account_left = ["ACCOUNT · V1", "ACCOUNT · V2", "ACCOUNT · V3"];
const account_right = [
  "ITERATION 1",
  "ITERATION 2",
  <span className="case-accent">FINAL PROTOTYPE</span>,
];

const misc_hifis = [pmo_library, pmo_onboarding, pmo_home3];
const misc_left = ["LIBRARY PAGE", "ONBOARDING FLOW", "LIVE DEMO"];
const misc_right = [
  <span className="case-accent">FINAL PROTOTYPE</span>,
  <span className="case-accent">FINAL PROTOTYPE</span>,
  <span className="case-accent">FINAL PROTOTYPE</span>,
];

const homeBullets = [
  "Added record player, refined tonearm visuals",
  "Emphasize one song at a time to counter information overload",
  "Changed navbar to pill format to reduce visual dominance",
];

const aboutBullets = [
  "Added record player",
  "Separated friends option from profile, added options to sync contacts and send profile to others",
  "Increased visuals for previous picks to reduce amount user has to read",
];

const reflectionBullets = [
  <>
    spent longer <span className="case-accent">ideating wireframes</span> and
    app structure — specifically the organization of the library page.
  </>,
  <>
    explored this concept as an{" "}
    <span className="case-accent">integrated feature</span> within Spotify as
    opposed to an independent app.
  </>,
  <>
    conducted <span className="case-accent">more formalized research</span> —
    possibly a survey. Most of my user research was based on what I'd heard from
    friends or found online.
  </>,
];

const takeawayBullets = [
  <>
    First <span className="case-accent-conditional">Figma</span> experience
  </>,
  <>
    First <span className="case-accent-conditional">UI/UX case study</span>{" "}
    experience
  </>,
  <>
    User Research: Designing with{" "}
    <span className="case-accent-conditional">empathy</span>
  </>,
];

export default function PutMeOn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={putmeon.theme as React.CSSProperties}>
      <nav className="case-nav">
        <button
          className="case-nav-link meta-text"
          onClick={() => history.back()}
        >
          ← BACK TO PORTFOLIO
        </button>
        <span className="meta-text">CASE STUDY · {putmeon.id} OF 01</span>
        <span className="meta-text">KAI HARASHIMA · UX · {putmeon.date}</span>
      </nav>
      <section
        className="case-hero"
        style={{
          background: `url(${backgroundCover}) no-repeat top center / 100% 65%, var(--cs-surface)`,
        }}
      >
        <div className="case-hero-meta">
          <span>{putmeon.dateSpecific}</span>
          <span>Kai Harashima — UX Designer</span>
        </div>
        <div className="case-hero-content">
          <div>
            <BrandLogo
              width={747}
              itemUrl={putmeon.altLogoUrl || putmeon.logoUrl}
              title={putmeon.title}
            />
            <p className="case-hero-subtitle">{putmeon.subheading}</p>
          </div>
          <div className="case-hero-info">
            <span className="case-hero-info-label">ROLE</span>
            <span>{putmeon.role}</span>
            <span className="case-hero-info-label">TOOLS</span>
            <span>{putmeon.tools}</span>
            <span className="case-hero-info-label">SCOPE</span>
            <span>{putmeon.scope}</span>
            <span className="case-hero-info-label">TIMELINE</span>
            <span>{putmeon.timeline}</span>
          </div>
        </div>
      </section>
      <CaseBand
        num={putmeon.id}
        name="Problem & Context"
        dark
        sub="Why this exists"
      >
        <CaseIntro
          pill="THE PROBLEM"
          title={
            <>
              Music discovery currently feels{" "}
              <span className="case-accent">ingenuous</span> and{" "}
              <span className="case-accent">algorithmic.</span>
            </>
          }
          dark={true}
          column={true}
          columnBody="Platforms like Spotify have been trying to maximize engagement through an infinite reels-style feed, but have lost something essential in the process."
        />
        <div className="case-inline-container">
          <CaseIntro
            pill="HOW MIGHT WE?"
            title={
              <>
                Help users{" "}
                <span className="case-accent">escape repetitive listening</span>{" "}
                habits and{" "}
                <span className="case-accent">discover new music</span> through
                friends and fellow music lovers.
              </>
            }
            dark={true}
            small={true}
          />
        </div>
      </CaseBand>

      <CaseBand
        num="02"
        name="User Research"
        dark={false}
        sub="Goals & pain points"
      >
        <CaseIntro
          pill="USER GOALS"
          title={
            <>
              Two kinds of listener, one{" "}
              <span className="case-accent">shared appetite</span>.
            </>
          }
        />
        <CaseTriad
          list={personas}
          listTitle="name"
          elemTitle="bullets"
          dark={true}
        />
        <CaseIntro
          pill="PAIN POINTS"
          title={<>What users actually said.</>}
          sub={true}
        />
        <div className="case-triad-quotes">
          {quotes.map((q, i) => (
            <blockquote key={i}>
              <p>"{q}"</p>
            </blockquote>
          ))}
        </div>
      </CaseBand>

      <CaseBand
        num="03"
        name="Lo-Fi Prototypes"
        dark
        sub="Pen, paper, repetition"
      >
        <CaseIntro
          title={
            <>
              Hand-drawn <span className="case-accent">first</span>.
            </>
          }
          dark={true}
        />
        <CaseDouble
          image1={pmo_wire1}
          image1Label="Brainstorming · Home / Profile / Library"
          pillText1="FIRST WIREFRAME"
          columnHeading1="Key Elements"
          columnSubheading1="KEY ELEMENTS"
          columnBullets1={[
            "Emphasis on album artwork",
            "Make process of finding friends and saving music frictionless",
          ]}
          image2={pmo_wire2}
          image2Label="Flow Chart · Onboarding + Save"
          pillText2="SECOND WIREFRAME"
          columnHeading2="Additional Features"
          columnSubheading2="ADDITIONAL FEATURES"
          columnBullets2={[
            "Added onboarding flow to introduce new features and reduce friction",
            "Added 'Save' feature to let users save songs without having to follow artists or playlists",
          ]}
        />
      </CaseBand>

      <CaseBand
        num="04"
        name="Hi-Fi Prototypes"
        dark={false}
        sub="Adding a record player, killing the canvas"
      >
        <CaseIntro
          title={
            <>
              Adding a <span className="case-accent">record player</span>,<br />
              killing the canvas.
            </>
          }
        />
        <CaseIntro
          pill="HOME PAGE: ITERATIONS"
          title={<>Home Page: Iterations</>}
          sub={true}
          column={true}
          columnBody={
            <>
              <div className="case-section-meta case-dark">KEY CHANGES</div>
              <CaseList
                bullets={homeBullets}
                dark={true}
              />
            </>
          }
        />
        <CaseIterations
          leftText={home_left}
          rightText={home_right}
          files={home_iter}
        />
        <CaseIntro
          pill="ABOUT PAGE: ITERATIONS"
          title={<>About Page: Iterations</>}
          sub={true}
          column={true}
          columnBody={
            <>
              <div className="case-section-meta case-dark">KEY CHANGES</div>
              <CaseList
                bullets={aboutBullets}
                dark={true}
              />
            </>
          }
        />
        <CaseIterations
          leftText={account_left}
          rightText={account_right}
          files={account_iter}
        />
        <CaseIntro
          pill="LIBRARY / ONBOARDING + LIVE"
          title={<>The rest of the app, in use.</>}
          sub={true}
        />
        <CaseIterations
          leftText={misc_left}
          rightText={misc_right}
          files={misc_hifis}
          noPadding={true}
        />
      </CaseBand>
      <CaseBand
        num="05"
        name="Reflections"
        dark
        sub="What I'd change · What I learned"
      >
        <CaseIntro
          pill="What would I change?"
          title={
            <>
              If I had <span className="case-accent">more time</span>, I
              would've…
            </>
          }
          dark
          column={true}
          columnBody={
            <CaseStack
              dark
              bullets={reflectionBullets}
            />
          }
        />
        <CasePill>TAKEAWAYS</CasePill>
        <CaseAccordion
          indices={["T1", "T2", "T3"]}
          bullets={takeawayBullets}
          descriptions={[
            "Picked up auto-layout, components, and variants from scratch — and learned how a tidy file keeps iteration fast.",
            "Practiced framing a problem, defending each decision, and telling the story end to end.",
            "Listening to real frustrations reshaped the product more than any feature idea I started with.",
          ]}
          dark
        />
      </CaseBand>
    </div>
  );
}

function BrandLogo({ width = 80, style = {}, itemUrl, title }: LogoProps) {
  return (
    <img
      className="card-logo"
      src={itemUrl}
      alt={title}
      style={{ width, height: "auto", display: "block", ...style }}
    />
  );
}
