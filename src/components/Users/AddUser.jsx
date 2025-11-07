import { Box } from "@mui/material";

const AddUser = () => {
  return (
    <Box>
      <Box
        className="form-actions"
        component="form"
        onSubmit={submitHandler}
        noValidate
      >
        <TextField
          required
          id="outlined-password-input"
          name="username"
          label="Name"
          type="text"
          value={user.username}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, nameSchema)
          }
          error={isError.username}
          helperText={error.username}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <TextField
          required
          id="outlined-password-input"
          name="email"
          label="email"
          type="email"
          value={user.email}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, emailSchema)
          }
          error={isError.email}
          helperText={error.email}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <TextField
          required
          id="outlined-password-input"
          name="password"
          label="Password"
          type="password"
          value={user.password}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, passwordSchema)
          }
          error={isError.password}
          helperText={error.password}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <TextField
          required
          id="outlined-password-input"
          name="mobile"
          label="Mobile Number"
          type="number"
          value={user.mobile}
          autoComplete="current-password"
          onChange={(e) =>
            changeHandler(e.target.name, e.target.value, mobileSchema)
          }
          error={isError.mobile}
          helperText={error.mobile}
          onFocus={(e) => focusHandler(e.target.name)}
        />
        <div className="form-button">
          <Button
            className="button signup-button"
            variant="contained"
            disabled={Object.values(isError).filter((el) => el).length > 0}
            type="submit"
          >
            SignUp{" "}
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default AddUser;
