import { apiPost } from "../services/apiMethods";
import endpoints from "../helper/endpoints";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";

interface UseCheckDuplicateDealProps {
  isCallable: boolean;
  title: string;
  link: string;
}

export function useCheckDuplicateDeal({
  isCallable,
  title,
  link,
}: UseCheckDuplicateDealProps) {
  const [debouncedTitle] = useDebounce(title, 500);
  const [debouncedLink] = useDebounce(link, 500);

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateDeal, setDuplicateDeal] = useState<any>(null);

  useEffect(() => {
    if (!isCallable) return;

    const payload = {
      title: debouncedTitle,
      deal_link: debouncedLink,
    };

    if (debouncedTitle || debouncedLink) {
      apiPost({
        endpoint: endpoints.uniqueTitle,
        payload,
        onSuccess: () => {
          setIsDuplicate(false);
          setDuplicateDeal(null);
        },
        onStatusFalse: (data) => {
          toast.error(data.message);
          setIsDuplicate(true);
          setDuplicateDeal(data?.existing_deal);
        },
        onError: (error) => {
          if (error?.existing_deal?.id) {
            setIsDuplicate(true);
            setDuplicateDeal(error?.existing_deal);
          }

          if (error.errors?.title?.[0]) {
            toast.error(error.errors?.title[0]);
          }

          if (error.errors?.deal_link?.[0]) {
            toast.error(error.errors?.deal_link[0]);
          }
        },
      });
    }
  }, [debouncedTitle, debouncedLink]);

  return { isDuplicate, duplicateDeal, setIsDuplicate, setDuplicateDeal };
}
