import {
  TextBodyExample,
  TextCaptionExample,
  TextEyebrowExample,
  TextHeadingExample,
  TextStackExample,
} from "@lairy/ui/text/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TextDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-32">
        <TextStackExample />
        <div className="flex flex-col gap-16">
          <TextEyebrowExample />
          <TextHeadingExample />
          <TextBodyExample />
          <TextCaptionExample />
        </div>
      </div>
    </ThemeToggle>
  );
}
