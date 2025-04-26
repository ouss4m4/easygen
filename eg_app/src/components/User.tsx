import { IProfile } from "@/api/typings";

export function User({ name, email }: IProfile) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <>
      <div className="flex flex-col items-center p-4 border rounded shadow-md w-60">
        <img src={avatarUrl} alt={`${name} avatar`} className="w-16 h-16 rounded-full mb-4" />
        <p className="text-sm text-gray-500">{email}</p>
        <p className="text-lg font-semibold">{name}</p>
      </div>

      <p className="text-sm text-center font-semibold  mt-4 animate-fadeIn">
        JWT expiry time is set to a short period on purpose to show the refresh functionality working.
      </p>
      <p className="text-sm text-center font-semibold  mt-4 animate-fadeIn">
        The profile is returned from the API using the JWT payload to show a JWT Guard working.
      </p>
    </>
  );
}
