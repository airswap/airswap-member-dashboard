import * as RadixAccordion from "@radix-ui/react-accordion";
import { ReactNode, useState } from "react";
import { MdChevronRight } from "react-icons/md";

interface AccordionProps {
  className?: string;
  type?: "single" | "multiple";
  itemId: string;
  trigger: ReactNode;
  content: ReactNode;
}

export const Accordion = ({
  className,
  type = "multiple",
  itemId,
  trigger,
  content,
}: AccordionProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const toggleAccordion = () =>
    setIsAccordionOpen((isAccordionOpen) => !isAccordionOpen);

  return (
    <RadixAccordion.Root className={className} type={type}>
      <RadixAccordion.Item
        className="flex flex-col overflow-hidden"
        value={itemId}
      >
        <RadixAccordion.Header className="flex py-4 pl-5 pr-4">
          {trigger}
          <RadixAccordion.Trigger
            className={"align-end align-end w-fit"}
            onClick={toggleAccordion}
          >
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
          </RadixAccordion.Trigger>
        </RadixAccordion.Header>
        <RadixAccordion.Content>{content}</RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
};
