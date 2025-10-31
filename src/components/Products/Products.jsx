import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ProductCard from "./ProductCard";
import TablePagination from "@mui/material/TablePagination";
import { Box, Stack, TextField, Button } from "@mui/material";
import AddProductCard from "./AddProductCard";
import { userContext } from "../../context/userContext";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

import Alert from "@mui/material/Alert";

const Products = () => {
  const { user } = useContext(userContext);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = useState(0);
  const [fetchTotal, setFetchTotal] = useState(true);
  const [searchObj, setSearchObj] = useState({createdAt: null});
  let [products, setProducts] = useState([]);
  const [cleared, setCleared] = React.useState(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  useEffect(() => {
    fetchCards();
  }, [page, rowsPerPage]);

  const fetchCards = async () => {
    console.log("search objct is", searchObj);
    console.log(searchObj?.createdAt?.format("YYYY-MM-DD"))
    // console.log(dayjs(searchObj?.createdAt).startOf("day").toISOString())
    let queryString = ``;
    if (searchObj) {
      if (searchObj?.name) {
        queryString += "&name=" + searchObj.name;
      }
      if (searchObj?.category) {
        queryString += "&category=" + searchObj.category;
      }if(searchObj?.createdAt){
        queryString += "&createdAt=" + searchObj?.createdAt?.format("YYYY-MM-DD")
      }
    }
    let product = await axios.get(
      `http://localhost:3000/products?page=${page}&rows=${rowsPerPage}&fetchTotal=${fetchTotal}` +
        queryString,
      {
        withCredentials: "true",
      }
    );

    setProducts(product?.data?.data);
    if (product?.data?.total) {
      setCount(product?.data?.total);
      setFetchTotal(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <DesktopDatePicker
                label="Search by date of created"
                sx={{ width: 260 }}
                value={searchObj.createdAt || null}
                onChange={(newValue) => {
                  // console.log("sssfsdfsdfsdf",newValue)
                  if (newValue) {
                    setSearchObj({ ...searchObj, createdAt: newValue });
                  }
                }}
                slotProps={{
                  field: {
                    clearable: true,
                    onClear: () => {
                      setSearchObj({ ...searchObj, createdAt: null });
                    },
                  },
                }}
              />

              {cleared && (
                <Alert
                  sx={{ position: "absolute", bottom: 0, right: 0 }}
                  severity="success"
                >
                  Field cleared!
                </Alert>
              )}
            </Box>
          </LocalizationProvider>
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
          {user.role == "admin" ? (
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
            >
              Add
            </Button>
          ) : null}

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
