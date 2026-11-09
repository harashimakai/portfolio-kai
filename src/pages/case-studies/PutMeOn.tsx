import {
  Accent,
  Body,
  Bullets,
  Callout,
  Cards,
  CaseStudy,
  Columns,
  FigureRow,
  Kicker,
  Section,
  Statement,
  Steps,
  Takeaways,
} from "../../features/case-study";

// Assets

import home1 from "../../assets/optimized/putmeon-home1.webp";
import home2 from "../../assets/optimized/putmeon-home2.webp";
import home3 from "../../assets/case-studies/putmeon/home3.mp4";
import home3Poster from "../../assets/optimized/putmeon-home3-poster.webp";
import homePopup from "../../assets/optimized/putmeon-home-popup.webp";
import account1 from "../../assets/optimized/putmeon-account1.webp";
import account2 from "../../assets/optimized/putmeon-account2.webp";
import account3 from "../../assets/case-studies/putmeon/account3.mp4";
import account3Poster from "../../assets/optimized/putmeon-account3-poster.webp";
import library from "../../assets/optimized/putmeon-library.webp";
import onboarding from "../../assets/case-studies/putmeon/onboarding.mp4";
import onboardingPoster from "../../assets/optimized/putmeon-onboarding-poster.webp";
import wordmark from "../../assets/case-studies/putmeon/wordmark.svg?raw";

// Page

export default function PutMeOn() {
  return (
    <CaseStudy
      slug="putmeon"
      title="Put Me On"
      logoSvg={wordmark}
      subtitle="a social music discovery platform / case study"
      meta={[
        { label: "Team", lines: ["Solo Project"] },
        { label: "Role", lines: ["Product Designer"] },
        { label: "Timeline", lines: ["2 Weeks"] },
        {
          label: "Tools & Skills",
          lines: ["UX Research", "Figma", "Visual Design", "Rapid Prototyping"],
        },
      ]}
    >
      <Section label="Overview">
        <Statement>
          Problem: Music discovery currently <br />
          feels <Accent>ingenuous</Accent> and <Accent>algorithmic.</Accent>
        </Statement>
        <Body>
          Platforms like Spotify have been trying to maximize engagement through
          an infinite reels-style feed, but have lost something essential in the
          process.
        </Body>
        <Callout
          label="Objective"
          text={
            <>
              How might we help users{" "}
              <Accent>escape repetitive listening</Accent> habits and{" "}
              <Accent>discover new music</Accent> through friends and fellow
              music lovers?
            </>
          }
        />
      </Section>
      <Section label="Process">
        <Statement>How I approached the problem</Statement>
        <Steps
          items={[
            {
              title: "Research",
              body: "Conducted five user interviews and looked through online discussions to better understand the problem space.",
            },
            {
              title: "Ideation",
              body: "Used user research findings to identify main priorities and pain points that addressed the user's feedback.",
            },
            {
              title: "Prototyping",
              body: "Began by creating a wireframe, addressing each issue before converting my ideas to a hi-fi prototype in Figma.",
            },
            {
              title: "Iteration",
              body: "Created three versions of the home and about screens, refining to reduce friction and improve visual design.",
            },
          ]}
        />
      </Section>
      <Section label="User research">
        <Statement>Based on interviews, here’s what I found:</Statement>
        <Cards
          items={[
            {
              title: "1.",
              lines: [
                "Users disapprove of music apps modeled after TikTok, Instagram, or YouTube to maximize active usage rather than passive listening",
              ],
            },
            {
              title: "2.",
              lines: [
                "Users report information overload: audiobook and podcast recommendations clutter the discovery page and make discovering new music more difficult",
              ],
            },
            {
              title: "3.",
              lines: [
                "Users want more emphasis on album art and social aspects of music discovery",
              ],
            },
          ]}
        />
        <Statement>
          I identified two distinct user bases, and the goals they share
        </Statement>
        <Cards
          className="study-gradient-cards"
          items={[
            {
              title: "Enjoyers",
              lines: [
                "Love music, but don't chase discovery",
                "Want a new favorite song without effort",
                "Trust their friends' taste more than playlists",
              ],
            },
            {
              title: "Both",
              lines: [
                "Want to see what their friends are loving right now",
                "Discover music without having to search through extensive playlists",
                "Connect and stay in touch with friends through music",
              ],
            },
            {
              title: "Explorers",
              lines: [
                "Want to diversify their taste",
                "Actively seek new genres and artists",
                "Feel like their recommendations are too algorithmic",
              ],
            },
          ]}
        />
      </Section>
      <Section label="Ideation">
        <Statement>Based on user feedback, what are my priorities?</Statement>
        <Columns
          items={[
            {
              title: "Key Elements",
              lines: [
                "Make process of discovering music more socially driven",
                "As this is a social app, finding your friends should be easy",
                "Counters information overload and allows users to slow down and listen to music rather than consume it",
                "Emphasis on album artwork",
              ],
            },
            {
              title: "Additional Features",
              lines: [
                "Added onboarding flow to introduce new features and reduce friction",
                "Added 'Save' feature integrated with music platforms so users can save songs without leaving the app",
              ],
            },
          ]}
        />
        <Statement>
          Solution: The <Accent>Weekly Recommendation</Accent>
        </Statement>
        <Body>
          Each friend shares <Accent>one pick</Accent> per week. Your home page
          shows you your friend's recommendations, one song at a time. By only
          allowing users one pick per week, Put Me On forces users to slow down
          and think about their recommendations. There's no infinite feed or
          algorithms, everything is chosen intentionally by people you know.
        </Body>
      </Section>
      <Section label="Prototyping + iteration">
        <Statement>The Home Page: Iterations</Statement>
        <FigureRow
          sequence
          items={[
            {
              src: home1,
              alt: "Home page, iteration 1",
              label: "Iteration 1",
              pros: ["Each friend's pick gets its own card with album art"],
              cons: [
                "Stacked cards lead to information overload",
                "There's no way to actually listen to the recommendations",
              ],
            },
            {
              src: home2,
              alt: "Home page, iteration 2",
              label: "Iteration 2",
              pros: [
                "The record player motif shows off the album art",
                "Only showing one song at a time forces listeners to slow down",
              ],
              cons: ["Full-width navbar adds visual weight"],
            },
            {
              src: home3,
              poster: home3Poster,
              alt: "Home page, final",
              label: "Final prototype",
              pros: [
                "Pill navbar floats over the page, reducing visual hierarchy",
                "Album art and the current pick stay in focus",
              ],
              cons: [],
            },
          ]}
        />
        <hr className="study-divider" />
        <Statement>The About Page: Iterations</Statement>
        <FigureRow
          sequence
          items={[
            {
              src: account1,
              alt: "Account page, iteration 1",
              label: "Iteration 1",
              pros: ["Weekly pick and past picks live in one place"],
              cons: [
                "Past picks are a plain text list that takes effort to read",
                "No way to find or add friends",
              ],
            },
            {
              src: account2,
              alt: "Account page, iteration 2",
              label: "Iteration 2",
              pros: [
                "Record player matches the home page",
                "Album thumbnails make past picks quick to scan",
              ],
              cons: ["Still no way to connect with friends"],
            },
            {
              src: account3,
              poster: account3Poster,
              alt: "Account page, final",
              label: "Final prototype",
              pros: [
                "Sync contacts and share profile make connecting frictionless",
                "Visual history of past picks means less to read",
              ],
              cons: [],
            },
          ]}
        />
      </Section>
      <Section label="Additional screens">
        <Statement>The finishing touches</Statement>
        <FigureRow
          sequence={false}
          items={[
            {
              src: library,
              alt: "Library page, final",
              label: "Library page",
              pros: [],
              cons: [],
            },
            {
              src: onboarding,
              poster: onboardingPoster,
              alt: "Onboarding flow, final",
              label: "Onboarding page",
              pros: [],
              cons: [],
            },
            {
              src: homePopup,
              alt: "Home page with a saved-to-library toast",
              label: "Save to library toast",
              pros: [],
              cons: [],
            },
          ]}
        />
      </Section>
      <Section label="Reflection">
        <Statement>If I had more time, I would’ve…</Statement>
        <Bullets
          grid
          items={[
            <>
              Spent longer <Accent>ideating wireframes</Accent> and app
              structure — specifically the organization of the library page.
            </>,
            <>
              Explored this concept as an <Accent>integrated feature</Accent>{" "}
              within Spotify as opposed to an independent app.
            </>,
            <>
              Conducted <Accent>more formalized research</Accent> — possibly
              through a survey to reach a wider base of users.
            </>,
          ]}
        />
        <Kicker>Takeaways</Kicker>
        <Takeaways
          items={[
            {
              title: (
                <>
                  First <Accent>Figma</Accent> experience
                </>
              ),
              body: "Picked up Figma in two weeks, going from using squares instead of frames to fully animated components by learning from more experienced designers.",
            },
            {
              title: (
                <>
                  First <Accent>UI/UX case study</Accent> experience
                </>
              ),
              body: "Learned how a UX case study comes together — navigating brainstorming, user research, and iterations while building lo-fi and hi-fi prototypes along the way.",
            },
            {
              title: (
                <>
                  User Research: Designing with <Accent>empathy</Accent>
                </>
              ),
              body: "I realized that design is about much more than how aesthetically pleasing something looks. Every aspect of a product must have intention and care behind it to truly improve users' lives.",
            },
          ]}
        />
      </Section>
    </CaseStudy>
  );
}
