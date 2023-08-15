import { ReactNode, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { MdChevronRight } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";

interface AccordionComponentProps {
  rootStyles: string | string[];
  itemId: string;
  triggerTitle: string;
  pointsPill: ReactNode;
  content: ReactNode;
}

// trigger is the dropdown. Content contains multiple (or single) items
const AccordionComponent = ({
  rootStyles,
  itemId,
  triggerTitle,
  pointsPill,
  content,
}: AccordionComponentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Accordion.Root
      className={twMerge(rootStyles)}
      type="single"
      defaultValue="item-1"
      collapsible
    >
      <Accordion.Item className="flex flex-col overflow-hidden" value={itemId}>
        <Accordion.Header>
          <Accordion.Trigger
            className={twJoin([
              "flex w-full items-center border border-border-dark p-3",
              "hover:bg-border-darkGray",
            ])}
          >
            <div className="flex w-full items-center justify-between pr-4">
              {triggerTitle}
              {pointsPill}
            </div>
            <div>
              <MdChevronRight size={32} className={"-rotate-90"} />
            </div>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={twMerge([
            "grid grid-cols-[auto,1fr,auto,auto]",
            "items-center border border-border-dark",
          ])}
        >
          {content}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccordionComponent;
