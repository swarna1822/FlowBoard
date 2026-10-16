import { useState } from "react";
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { PEOPLE } from "../../data/seed";
import PersonAvatar from "../../components/PersonAvatar";
import { submitCheckin } from "../../Redux/actions";

const statusChip = (status: string) => {
  if (status === "blocked")
    return { color: "#c9372c", bg: "#f8714333", text: "Blocked" };
  if (status === "on_track")
    return { color: "#22a06b", bg: "#22a06b33", text: "On track" };
  return { color: "#172b4d", bg: "#dcdfe4", text: "Not submitted" };
};

const CheckIn = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const checkins = useSelector((state: RootState) => state.board.checkins);
  const mine = checkins.find((item) => item.personId === (user?.personId ?? "AK"));
  const [yesterday, setYesterday] = useState(mine?.yesterday ?? "");
  const [today, setToday] = useState(mine?.today ?? "");
  const [blockers, setBlockers] = useState(mine?.blockers ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Daily check-in
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1.5,
        }}
      >
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, p: 2, bgcolor: "#fff" }}>
          <TextField
            label="Yesterday I…"
            fullWidth
            multiline
            minRows={2}
            margin="dense"
            value={yesterday}
            onChange={(event) => setYesterday(event.target.value)}
          />
          <TextField
            label="Today I will…"
            fullWidth
            multiline
            minRows={2}
            margin="dense"
            value={today}
            onChange={(event) => setToday(event.target.value)}
          />
          <TextField
            label="Blockers"
            placeholder="None"
            fullWidth
            multiline
            minRows={2}
            margin="dense"
            value={blockers}
            onChange={(event) => setBlockers(event.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => {
              dispatch(submitCheckin(user?.personId ?? "AK", yesterday, today, blockers));
              setSaved(true);
            }}
          >
            {saved ? "✓ Submitted" : "Submit check-in"}
          </Button>
        </Box>
        <Box sx={{ border: "1px solid #dcdfe4", borderRadius: 1.5, bgcolor: "#fff" }}>
          {checkins.map((item) => {
            const chip = statusChip(item.status);
            const person = PEOPLE[item.personId];
            return (
              <Box
                key={item.personId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.5,
                  py: 1.1,
                  borderBottom: "1px solid #dcdfe4",
                  "&:last-child": { borderBottom: 0 },
                }}
              >
                <PersonAvatar personId={item.personId} />
                <Typography sx={{ flex: 1, fontWeight: 500 }}>
                  {item.status === "blocked"
                    ? `${person.name} · ${item.blockers || "Blocked"}`
                    : person.name}
                </Typography>
                <Chip
                  size="small"
                  label={chip.text}
                  sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 700 }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default CheckIn;
