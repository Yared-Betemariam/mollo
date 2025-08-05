import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const ValueChanger = ({ value, onChange }: Props) => {
  return (
    <div>
      <Input
        className="shadow-none bg-zinc-900/5"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default ValueChanger;
