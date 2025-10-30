import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ProductCard from "./ProductCard";
import TablePagination from "@mui/material/TablePagination";
import { Box, Stack, TextField, Button } from "@mui/material";
import AddProductCard from "./AddProductCard";
import {userContext} from "../../context/userContext";

const Products = () => {
  const {user} = useContext(userContext);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  const [fetchTotal, setFetchTotal] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [searchObj, setSearchObj] = useState({});
  let [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("user",user)
    fetchCards();
  }, [page, rowsPerPage]);

  const fetchCards = async () => {
    let queryString = ``;
    if (searchObj) {
      if (searchObj?.name) {
        queryString += "&name=" + searchObj.name;
      }
      if (searchObj?.category) {
        queryString += "&category=" + searchObj.category;
      }
    }
    let product = await axios.get(
      `http://localhost:3000/products?page=${page}&rows=${rowsPerPage}&fetchTotal=${fetchTotal}` +
        queryString,
      {
        withCredentials: "true",
      }
    );
    console.log("products", product?.data);
    setProducts(product?.data?.data);
    if (product?.data?.total) {
      setCount(product?.data?.total);
      setFetchTotal(false);
    }
  };

  const editProduct = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, updatedData, {
        withCredentials: true,
      });
      fetchCards();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:3000/products/${id}`, {
      withCredentials: true,
    });
    fetchCards();
  };

  return (
    <Box sx={{ padding: 5, display: "flex", flexDirection: "column", gap: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            id="filled-search"
            name="name"
            label="Search by product name"
            type="search"
            variant="outlined"
            value={searchObj?.name}
            onChange={(e) => {
              setSearchObj({ ...searchObj, [e.target.name]: e.target.value });
            }}
          />
          <TextField
            id="filled-search"
            name="category"
            label="Search by category"
            type="search"
            value={searchObj?.category}
            onChange={(e) => {
              setSearchObj({ ...searchObj, [e.target.name]: e.target.value });
            }}
            variant="outlined"
          />
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ width: "50%" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            variant="outlined"
            endIcon={<SearchIcon />}
            loading:false
            loadingPosition="start"
            onClick={() => {
              fetchCards();
              setPage(0);
              setFetchTotal(true);
            }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Add
          </Button>
          <AddProductCard
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onAddSuccess={() => {
              fetchCards();
              setFetchTotal(true);
            }}
          />
        </Stack>
      </Box>

      <Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "flex-start",
            }}
          >
            {products.map((el) => (
              <ProductCard
                key={el._id}
                id={el._id}
                name={el.name}
                description={el.description}
                price={el.price}
                image={el.image}
                category={el.category}
                userRole={user.role}
                onEdit={editProduct}
                onDelete={deleteProduct}
              />
            ))}
          </Box>
          <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
