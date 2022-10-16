import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Grid
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Grid item md={3} xs={6}>
      <Card className="card">
        <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>{product.name}</Typography>
          <Typography variant="h6" style={{fontWeight: "bold"}} gutterBottom>${product.cost}</Typography>
          <Rating value={product.rating} precision={1} name="read-only" readOnly/>
        </CardContent>
        <CardActions className="card-actions">
          <Button variant="contained" className="card-button" onClick={() => handleAddToCart(product._id, 1)}><AddShoppingCartOutlined style={{marginRight: "0.5rem"}}/>ADD TO CART</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
