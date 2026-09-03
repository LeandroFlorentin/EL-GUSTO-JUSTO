import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/features/services/api/get-services';
import { servicesKeys } from '@/features/services/api/query-keys';

export const useServices = () => {
  return useQuery({
    queryKey: servicesKeys.all,
    queryFn: getServices,
  });
};
