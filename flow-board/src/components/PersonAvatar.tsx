import { Avatar, Tooltip } from "@mui/material";
import { PEOPLE } from "../data/seed";

type Props = {
  personId: string;
  size?: number;
  onClick?: () => void;
  selected?: boolean;
};

const PersonAvatar = ({ personId, size = 28, onClick, selected }: Props) => {
  const person = PEOPLE[personId];
  if (!person) return null;

  return (
    <Tooltip title={person.name}>
      <Avatar
        onClick={onClick}
        sx={{
          width: size,
          height: size,
          fontSize: size < 28 ? 10 : 11,
          fontWeight: 700,
          bgcolor: person.color,
          cursor: onClick ? "pointer" : "default",
          outline: selected ? "2px solid #6366f1" : "2px solid #fff",
          outlineOffset: selected ? 1 : 0,
        }}
      >
        {person.id}
      </Avatar>
    </Tooltip>
  );
};

export default PersonAvatar;
