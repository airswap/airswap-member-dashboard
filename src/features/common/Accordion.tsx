import * as Accordion from "@radix-ui/react-accordion";
import { MdChevronRight } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { ReactNode, useState } from "react";

interface AccordionComponentProps {
  itemId: string;
  triggerTitle: string;
  pointsPill: ReactNode;
  content: ReactNode;
}

const AccordionComponent = ({
  itemId,
  triggerTitle,
  pointsPill,
  content,
}: AccordionComponentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Accordion.Root
      className="w-full items-center border border-border-dark"
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
            <div onClick={() => (!isOpen ? setIsOpen(true) : setIsOpen(false))}>
              {!isOpen ? (
                <MdChevronRight size={32} className={"-rotate-90"} />
              ) : (
                <MdChevronRight size={32} className={"rotate-90"} />
              )}
            </div>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>{content}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccordionComponent;
