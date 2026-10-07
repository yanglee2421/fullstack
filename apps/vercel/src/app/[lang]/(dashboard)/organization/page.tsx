import { Add } from "./add";
import { Overtimes } from "./overtimes";

export default async function Page() {
  return (
    <div className="space-y-4 p-4">
      <Overtimes />
      <Add />
    </div>
  );
}
