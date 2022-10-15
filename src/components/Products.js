import { AirSharp, Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack
} from "@mui/material";
import { Box, margin } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  useEffect(() => {
    performAPICall();
  }, []);

  const performAPICall = async () => {
    const reqOptions = {
      method: "get",
      url: `${config.endpoint}/products`,
    }

    setIsLoading(true);

    try {
      const res = await axios(reqOptions);
      setProducts(res.data);
    } catch {
      enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  const productList = (
    <Grid container spacing={2} className="product-grid">
      {products.map(product => <ProductCard product={product} key={product._id}/>)} 
    </Grid>
  )
  
  const progressIndicator = (
    <Stack direction="column" alignItems="center" style={{margin: "10rem 0"}}>
      <CircularProgress color="success" />
      <p>Loading Products...</p>
    </Stack>
  );

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const [searchString, setSearchString] = useState("");

  const searchHandler = (e) => {
    const value = e.target.value;
    setSearchString(value);

    debounceSearch(e, 500);
  }

  const performSearch = async (text) => {
    const reqOptions = {
      method: "get",
      url: `${config.endpoint}/products/search?value=${text}`,
    }

    setIsLoading(true);

    try {
      const res = await axios(reqOptions);
      console.log(res)
      setProducts(res.data);
    } catch (error) {
      if (error.response) {
        setProducts(error.response.data);
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const noProductsIndicator = (
    <Stack direction="column" alignItems="center" style={{margin: "10rem 0"}}>
      <SentimentDissatisfied />
      <p>No products found</p>
    </Stack>
  ); 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const [timerId, setTimerId] = useState(null);

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(timerId);

    const searchValue = event.target.value;
    setTimerId(setTimeout(performSearch.bind(this, searchValue), debounceTimeout));
  };


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <div className="search-desktop">
          <TextField
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={searchHandler}
          />
        </div>
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
          to your door step
        </p>
      </Box>
      <Box style={{padding: "2rem 1rem"}}>
        {isLoading && progressIndicator}
        {products.length !== 0 ? productList : noProductsIndicator}
      </Box>
      <Footer/>
    </div>
  );
};

export default Products;
