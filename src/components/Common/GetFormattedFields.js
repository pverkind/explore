import { Box } from "@mui/material";

const GetFormattedFields = ({ data, type }) => {
  //console.log(data);
  if (data === undefined) {
    return []
  }
  // author.relation_type_code
  const filtered = data.filter((item) => {
    return item.relation_type_code === type;
  });

  const getTitle = () => {
    if (type === "BORN") {
      return "was born in:";
    } else if (type === "DIED") {
      return "died in:";
    } else if (type === "RESID") {
      return "resided in:";
    } else if (type === "VISIT") {
      return "visited:";
    } else if (type === "COMM") {
      return "has commentary (sharḥ):";
    }
  };

  return (
    filtered.length !== 0 && (
      <ul>
        <li>{getTitle()}</li>
        <Box px={2}>
          {filtered.map((item, i) => (
            <li style={{ listStyleType: "circle" }} key={i}>
              {type === "COMM" ? item.related_text_uri : item.related_place_uri}
            </li>
          ))}
        </Box>
      </ul>
    )
  );
};

export default GetFormattedFields;
