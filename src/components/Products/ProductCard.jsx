import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EditProductCard from "./EditProductCard";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  category,
  userRole,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  console.log("image", image);
  const handleSaveEdit = (updatedData) => {
    onEdit(id, updatedData);
    setOpen(false);
  };

  return (
    <Card
      sx={{ width: 300, backgroundColor: "lightgray", position: "relative" }}
    >
      {userRole === "admin" && (
        <>
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={() => setOpen(true)}
          >
            <MoreVertIcon />
          </IconButton>

          <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
              <EditProductCard
                product={{ id, name, description, price, image, category }}
                onSave={handleSaveEdit}
                onCancel={() => setOpen(false)}
              />
            </Box>
          </Modal>
        </>
      )}

      <CardMedia sx={{ height: 160 }} image={image} />

      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{description}</Typography>
        <Typography variant="subtitle2">Category: {category}</Typography>
        <Typography variant="h6">₹{price}</Typography>
      </CardContent>

      {userRole === "admin" && (
        <Box sx={{ padding: "0 16px 16px" }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ borderRadius: 2, fontWeight: 600 }}
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;
