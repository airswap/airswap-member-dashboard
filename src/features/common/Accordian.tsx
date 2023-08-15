import * as Accordion from "@radix-ui/react-accordion";
import { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface AccordionComponentProps {
  rootClassName?: string;
  type?: "single" | "multiple";
  itemClassName?: string[] | string;
  children: ReactNode[] | ReactNode;
}

const AccordionComponent = ({
  rootClassName,
  itemClassName,
  children,
}: AccordionComponentProps) => {
  // const accordionItems = () => {
  //   const itemClasses = Array.isArray(itemClassName) ? itemClassName : [];
  //   const childNodes = Array.isArray(children) ? children : [];

  //   const items = [];
  //   for (let i = 0; i < Math.max(itemClasses.length, childNodes.length); i++) {
  //     items.push(
  //       <Accordion.Item
  //         className={twMerge([itemClasses[i] || `item-${i}`, "w-ful border"])}
  //         value={(i + 1).toString()}
  //         key={i}
  //       >
  //         <Accordion.Trigger>
  //           <FaChevronDown className={"-rotate-90"} aria-hidden />
  //         </Accordion.Trigger>
  //         <Accordion.Content>{childNodes[i]}</Accordion.Content>
  //       </Accordion.Item>,
  //     );
  //   }
  //   return items;
  // };

  return (
    <Accordion.Root className={twMerge(rootClassName)} type="multiple">
      <Accordion.Item value={children}>
        <Accordion.Header>
          <Accordion.Trigger />
        </Accordion.Header>
        <Accordion.Content />
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccordionComponent;
