// import type { ReactNode } from "react";

const StackablePair = (props: { children: JSX.Element[] }) => {
  const [card, ...rest] = props.children;
  return (
    <div className="stackable">
      <div className="stackable-item elevated-card">
        {card}
      </div>
      <div className="stackable-item">
        {rest}
      </div>
    </div>
  )
};

export default StackablePair;