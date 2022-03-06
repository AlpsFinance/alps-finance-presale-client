import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { TimelineItem, TimeLineData } from "./TimelineItem";

const Timeline: React.FC = () => {
  const timelines: TimeLineData[] = [
    {
      round: 0,
      title: "PRESALE A (7 Mar 2022 - 13 Mar 2022)",
      amount: 50000000,
      unit: "$0.025",
    },
    {
      round: 1,
      title: "PRESALE B (14 Mar 2022 - 20 Mar 2022)",
      amount: 100000000,
      unit: "$0.050",
    },
    {
      round: 2,
      title: "PRESALE C (21 Mar 2022 - 27 Mar 2022)",
      amount: 100000000,
      unit: "$0.075",
    },
  ];

  return (
    <Grid
      container
      sx={{
        my: 5,
      }}
      justifyContent="center"
    >
      <Grid
        item
        lg={5}
        md={7}
        xs={11}
        sx={{
          boxShadow: "0px 3px 11px 4px rgba(18, 209, 6, 0.25)",
          borderRadius: 3,
          pt: 2,
          px: 2,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          TIMELINE ALPS
        </Typography>
        {timelines.map((timeline: TimeLineData, index: number) => (
          <TimelineItem {...timeline} key={`timeline-${index}`} />
        ))}
        {/* Comment this out until litepaper comes out */}
        {/* <Box textAlign="center">
          <Button
            color="inherit"
            variant="contained"
            sx={{
              borderRadius: 5,
              color: "white",
              background:
                "linear-gradient(274.61deg, #0D7E06 18.06%, #00BB89 125.98%)",
              py: 1,
              fontWeight: "bold",
              mb: 4,
            }}
            onClick={() => {}}
          >
            Read Litepaper
          </Button>
        </Box> */}
      </Grid>
    </Grid>
  );
};

export default Timeline;
