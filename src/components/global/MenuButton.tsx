import { motion } from "motion/react";

interface Props {
  sideOpen: boolean;
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuButton({ sideOpen, setSideOpen }: Props) {
  return (
    <motion.button
      className="menu-button"
      onClick={() => setSideOpen(!sideOpen)}
      initial={"false"}
      animate={sideOpen ? "open" : "closed"}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 22.5 16"
      >
        <motion.path
          className="menu-path"
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          className="menu-path"
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          className="menu-path"
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </motion.button>
  );
}
