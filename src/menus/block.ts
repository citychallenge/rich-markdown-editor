import {
  BulletedListIcon,
  Heading1Icon,
  HorizontalRuleIcon,
  OrderedListIcon,
  ImageIcon,
} from "outline-icons";
import { MenuItem } from "../types";

export default function blockMenuItems(): MenuItem[] {
  return [
    {
      name: "heading",
      title: "Heading",
      keywords: "h1 heading1 title",
      icon: Heading1Icon,
      shortcut: "^ ⇧ 1",
      attrs: { level: 1 },
    },
    {
      name: "separator",
    },
    {
      name: "bullet_list",
      title: "Bulleted list",
      icon: BulletedListIcon,
      shortcut: "^ ⇧ 8",
    },
    {
      name: "ordered_list",
      title: "Ordered list",
      icon: OrderedListIcon,
      shortcut: "^ ⇧ 9",
    },
    {
      name: "separator",
    },
    {
      name: "hr",
      title: "Divider",
      icon: HorizontalRuleIcon,
      shortcut: "⌘ _",
      keywords: "horizontal rule break line",
    },
    {
      name: "image",
      title: "Image",
      icon: ImageIcon,
      keywords: "picture photo",
    },
  ];
}
