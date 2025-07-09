'use client';

import { SimpleGrid, Skeleton } from '@mantine/core';
import classes from './StatsGrid.module.css';
import { ReactNode } from 'react';
import { ErrorAlert } from '@/components';
import GroupCard from '../GroupCard/GroupCard';

type StatsGridProps = {
  data?: any[]; // ahora serán tus grupos completos
  error?: ReactNode;
  loading?: boolean;
};

export default function StatsGrid({
  data,
  loading,
  error,
}: StatsGridProps) {
  const stats = data?.map((grupo) => (
    <GroupCard key={grupo.id} grupo={grupo} />
  ));

  return (
    <div className={classes.root}>
      {error ? (
        <ErrorAlert title="Error al cargar grupos" message={error.toString()} />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((o, i) => (
                <Skeleton
                  key={`stats-loading-${i}`}
                  visible={true}
                  height={200}
                />
              ))
            : stats}
        </SimpleGrid>
      )}
    </div>
  );
}
