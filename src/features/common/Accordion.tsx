import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { twJoin } from "tailwind-merge";

interface AccordionComponentProps {
  rootStyles: string;
  type?: "single" | "multiple";
  itemId: string;
  trigger: ReactNode;
  content: ReactNode;
}

const AccordionComponent = ({
  rootStyles,
  type = "multiple",
  itemId,
  trigger,
  content,
}: AccordionComponentProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const toggleChevronIconUp = () =>
    setIsAccordionOpen((isAccordionOpen) => !isAccordionOpen);

  return (
    <Accordion.Root className={rootStyles} type={type}>
      <Accordion.Item className="flex flex-col overflow-hidden" value={itemId}>
        <Accordion.Header>
          <div className={twJoin(["flex border border-border-dark p-3"])}>
            {trigger}
            <Accordion.Trigger className={"align-end align-end w-fit"}>
              <div onClick={toggleChevronIconUp}>
                {!isAccordionOpen ? (
                  <MdChevronRight size={32} className={"rotate-90"} />
                ) : (
                  <MdChevronRight size={32} className={"-rotate-90"} />
                )}
              </div>
            </Accordion.Trigger>
          </div>
        </Accordion.Header>
        <Accordion.Content>{content}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccordionComponent;
