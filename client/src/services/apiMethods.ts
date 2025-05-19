import { handleShowErrorToast } from "../helper/utils";
import { toast } from "react-toastify";
import API from "./api";
import axios from "axios";

interface FetchMetaOptions {
  url?: string;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

interface BaseOptions {
  endpoint: string;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

interface PayloadOptions extends BaseOptions {
  payload: any;
}

interface PostApiOptions extends BaseOptions {
  payload: any;
  onStatusFalse?: (data: any) => void;
}

export const fetchMetadata = async ({
  url,
  onSuccess,
  onError,
  onFinally,
}: FetchMetaOptions) => {
  if (!url) return {};

  const endpoint = "http://localhost:5000/api/meta";

  try {
    const { data } = await axios.post(endpoint, { url });
    onSuccess(data);
  } catch (error) {
    handleShowErrorToast(error);
    onError?.(error);
  } finally {
    onFinally?.();
  }
};

export const apiGet = async ({
  endpoint,
  onSuccess,
  onError,
  onFinally,
}: BaseOptions) => {
  try {
    const { data } = await API.get(endpoint);
    if (!data?.status) return toast.error(data?.message);
    onSuccess(data);
  } catch (error) {
    handleShowErrorToast(error);
    onError?.(error);
  } finally {
    onFinally?.();
  }
};

export const apiPost = async ({
  endpoint,
  payload,
  onSuccess,
  onError,
  onFinally,
  onStatusFalse,
}: PostApiOptions) => {
  try {
    const { data } = await API.post(endpoint, payload);
    if (!data?.status) {
      onStatusFalse?.(data);
      return toast.error(data?.message);
    }
    onSuccess(data);
  } catch (error) {
    handleShowErrorToast(error);
    onError?.(error);
  } finally {
    onFinally?.();
  }
};

export const apiPut = async ({
  endpoint,
  payload,
  onSuccess,
  onError,
  onFinally,
}: PayloadOptions) => {
  try {
    const { data } = await API.put(endpoint, payload);
    if (!data?.status) return toast.error(data?.message);
    onSuccess(data);
  } catch (error) {
    handleShowErrorToast(error);
    onError?.(error);
  } finally {
    onFinally?.();
  }
};

export const apiDelete = async ({
  endpoint,
  onSuccess,
  onError,
  onFinally,
}: BaseOptions) => {
  try {
    const { data } = await API.delete(endpoint);
    if (!data?.status) return toast.error(data?.message);
    onSuccess(data);
  } catch (error) {
    handleShowErrorToast(error);
    onError?.(error);
  } finally {
    onFinally?.();
  }
};
