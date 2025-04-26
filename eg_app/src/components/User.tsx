import { IProfile } from "@/api/typings";

export function User({ name, email, id }: IProfile) {
  return (
    <div className="flex flex-col">
      <p>{id}</p>
      <p>{email}</p>
      <p>{name}</p>
    </div>
  );
}
