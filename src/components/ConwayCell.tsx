import { twMerge } from "tailwind-merge";

export type ConwayCellProps = {
    isAlive: boolean;
    onClick: () => void;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
}

export const ConwayCell = ({isAlive, onClick, activeClassName, inactiveClassName}: ConwayCellProps) => {

  return (
    <div
      className= {!isAlive ? twMerge('bg-gray-200 border', inactiveClassName) : twMerge('bg-white', activeClassName, 'cursor-pointer')}
      onClick={onClick}
    />
  );
}