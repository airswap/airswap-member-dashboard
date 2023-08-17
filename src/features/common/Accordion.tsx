import * as RadixAccordion from "@radix-ui/react-accordion";
import { MdChevronRight } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { ReactNode, useState } from "react";

interface AccordionProps {
  rootStyles: string;
  type?: "single" | "multiple";
  itemId: string;
  trigger: ReactNode;
  content: ReactNode;
}

export const Accordion = ({
  rootStyles,
  type = "multiple",
  itemId,
  trigger,
  content,
}: AccordionProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const toggleAccordion = () =>
    setIsAccordionOpen((isAccordionOpen) => !isAccordionOpen);

  return (
    <RadixAccordion.Root className={rootStyles} type={type}>
      <RadixAccordion.Item
        className="flex flex-col overflow-hidden"
        value={itemId}
      >
        <RadixAccordion.Header>
          <div
            className={twJoin([
              "flex border border-border-dark p-3",
              "hover:bg-border-darkGray",
            ])}
          >
            {trigger}
            <RadixAccordion.Trigger className={"align-end align-end w-fit"}>
              <div onClick={toggleAccordion}>
                {!isAccordionOpen ? (
                  <MdChevronRight
                    size={32}
                    className="rotate-90 transition-transform duration-150"
                  />
                ) : (
                  <MdChevronRight
                    size={32}
                    className="-rotate-90 transition-transform duration-150"
                  />
                )}
              </div>
            </RadixAccordion.Trigger>
          </div>
        </RadixAccordion.Header>
        <RadixAccordion.Content>{content}</RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
};
