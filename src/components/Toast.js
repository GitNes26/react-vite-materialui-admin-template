import { useSnackbar } from "notistack";

const Success = ({ msg }) => {
   const { enqueueSnackbar } = useSnackbar();
   enqueueSnackbar(msg, { variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
};
const Error = ({ msg }) => {
   const { enqueueSnackbar } = useSnackbar();
   enqueueSnackbar(msg, { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
};
const Info = ({ msg }) => {
   const { enqueueSnackbar } = useSnackbar();
   enqueueSnackbar(msg, { variant: "info", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
};
const Warning = ({ msg }) => {
   const { enqueueSnackbar } = useSnackbar();
   enqueueSnackbar(msg, { variant: "warning", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
};
const Default = ({ msg }) => {
   const { enqueueSnackbar } = useSnackbar();
   enqueueSnackbar(msg, { variant: "default", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
};

export default {
   Success,
   Error,
   Info,
   Warning,
   Default
};
