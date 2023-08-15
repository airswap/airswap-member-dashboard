import { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { MdChevronRight, MdClose, MdOpenInNew } from "react-icons/md";
import { Proposal } from "../votes/hooks/useGroupedProposals";

interface AccordionComponentProps {
  items: Proposal[];
  trigger: ReactNode;
  content: ReactNode[];
  itemClasses?: string;
  rootStyles?: string;
  contentClass?: string;
}

interface AccordionTriggerProps {
  trigger: ReactNode;
}

interface AccordionContentProps {
  content: ReactNode;
}

export const AccordionTrigger = ({
  trigger,
  ...props
}: AccordionTriggerProps) => {
  return (
    <Accordion.Trigger {...props}>
      <MdChevronRight className="AccordionChevron" aria-hidden />
      {trigger}
    </Accordion.Trigger>
  );
};

export const AccordionContent = ({
  content,
  ...props
}: AccordionContentProps) => {
  return <Accordion.Content {...props}>{content}</Accordion.Content>;
};

const AccordionComponent = ({
  rootStyles,
  items,
  itemClasses,
  trigger,
  content,
}: AccordionComponentProps) => {
  const accordionItems = () => {
    return items.map((item: Proposal) => {
      return (
        <Accordion.Item
          className={itemClasses}
          value={`item-${item.id}`}
          key={item.id}
        >
          <Accordion.Header>
            <AccordionTrigger trigger={trigger} />
          </Accordion.Header>
          <AccordionContent content={content} />
        </Accordion.Item>
      );
    });
  };

  return (
    <>
      <Accordion.Root
        className={rootStyles}
        type="single"
        defaultValue="item-1"
        collapsible
      >
        {accordionItems()}
      </Accordion.Root>
    </>
  );
};

export default AccordionComponent;
