import { useAtomValue, type Atom } from "jotai";
import { LoaderCircle } from "lucide-react";
import { Suspense, type ReactNode } from "react";

function Awaiter<T>({
  atom,
  render,
}: {
  atom: Atom<Promise<T>>;
  render: (atomValue: T) => ReactNode;
}) {
  const atomValue = useAtomValue(atom);
  return render(atomValue);
}

export default function AwaitAtom<T>({
  atom,
  defaultValue,
  render,
}: {
  atom?: Atom<Promise<T>>;
  defaultValue?: T;
  render: (atomValue: T) => ReactNode;
}) {
  return atom ? (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <Awaiter atom={atom} render={render} />
    </Suspense>
  ) : defaultValue ? (
    render(defaultValue)
  ) : null;
}
