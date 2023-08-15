import * as Accordion from "@radix-ui/react-accordion";
import { MdChevronRight } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { ReactNode, useState } from "react";
import { Checkbox } from "./Checkbox";

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
  const toggleOpen = () => setIsOpen((prevState) => !prevState);

  return (
    <Accordion.Root
      className="w-full items-center border border-border-dark"
      type="single"
      collapsible
    >
      <Accordion.Item className="flex flex-col overflow-hidden" value={itemId}>
        <Accordion.Header>
          <div
            className={twJoin([
              "flex rounded border border-border-dark p-3",
              "hover:bg-border-darkGray",
            ])}
          >
            <div className="flex w-full items-center justify-between pr-4 font-semibold">
              <div className="flex items-center">
                <div className="align-center -mt-1 mr-4 items-center ">
                  <Checkbox />
                </div>
                {triggerTitle}
              </div>
              {pointsPill}
            </div>
            {/* only want arrow to trigger opening */}
            <Accordion.Trigger className={"w-fit items-center"}>
              <div onClick={toggleOpen}>
                {!isOpen ? (
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
