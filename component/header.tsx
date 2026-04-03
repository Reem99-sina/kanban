import { Box } from "@mui/material";
import GridViewTwoToneIcon from "@mui/icons-material/GridViewTwoTone";
import { CustomTextField } from "./TextCustom";
import { useGetTasks } from "@/action/tasksApi";
import Typography from "@mui/material/Typography";
import { useTaskStore } from "@/store/task";

export function Header() {
  const { data } = useGetTasks();
  const { setSearch,search } = useTaskStore();

  return (
    <Box
      component="header"
      sx={{ p: 2, borderBottom: "1px solid gray" }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        <Box borderRadius={2} bgcolor="#312b72" padding={1}>
          <GridViewTwoToneIcon fontSize="small" sx={{ color: "white" }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} color="black">
            KANBAN BOARD
          </Typography>
          <Typography color="black" sx={{ fontSize: 12 }}>
            {data?.length || 0} Tasks
          </Typography>
        </Box>
      </Box>
      <CustomTextField value={search} onChange={(e) => setSearch(e.target.value)} />
    </Box>
  );
}
