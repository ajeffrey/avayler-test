import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useDataLoader } from '../lib/useDataLoader';
import { getSpacexData } from '../lib/getSpacexData';
import { useIndex } from '../lib/useIndex';
import * as Types from '../types';
import { Launch } from '../components/Launch';

const API_URL = 'https://api.spacexdata.com';
const QUERY_LAUNCHES_URL = `${API_URL}/v5/launches/query`
const QUERY_PAYLOADS_URL = `${API_URL}/v4/payloads/query`;
const QUERY_CORES_URL = `${API_URL}/v4/cores/query`;

interface SearchResults<T> {
  docs: T[];
}

const LAUNCH_PARAMS = {
  query: { upcoming: false },
  options: {
    sort: { date_unix: -1 },
    limit: 10,
  },
};

export default function Home() {
  const launches = useDataLoader<SearchResults<Types.Launch>>(() => getSpacexData(
    QUERY_LAUNCHES_URL,
    LAUNCH_PARAMS
  ), []);
  
  const payloads = useDataLoader<SearchResults<Types.Payload> | null>(async () => {
    if(!launches.data) {
      return null;
    }

    const payloadIds = launches.data.docs.flatMap(({ payloads }) => payloads);
    return await getSpacexData(QUERY_PAYLOADS_URL, {
      query: {
        id: { $in: payloadIds }
      },
      options: {
        limit: 1000,
      }
    });
  }, [launches.data]);

  const cores = useDataLoader<SearchResults<Types.Core> | null>(async () => {
    if(!launches.data) {
      return null;
    }

    const coreIds = [];
    for(const launch of launches.data.docs) {
      if(launch.cores.length > 0) {
        coreIds.push(launch.cores[0].core);
      }
    }

    return await getSpacexData(QUERY_CORES_URL, {
      query: {
        id: { $in: coreIds }
      },
      options: {
        limit: 1000,
      }
    });
  }, [launches.data]);

  const payloadsIndex = useIndex(payloads.data?.docs, 'id');
  const coresIndex = useIndex(cores.data?.docs, 'id');
  
  if(!(payloadsIndex && coresIndex)) {
    return <div className={styles.loading}>loading...</div>;
  }

  const error = launches.error || payloads.error;
  if(error) {
    return <div>Error: {error}</div>;
  }

  console.log('launches', launches, 'payloads', payloadsIndex, 'cores', coresIndex);

  return (
    <div className={styles.background}>
      <Head>
        <title>SpaceX Launches</title>
      </Head>
      <div className={styles.launches}>
        {(launches.data?.docs || []).map(launch => {
          const core = launch.cores.length > 0 ? coresIndex[launch.cores[0].core] : null;
          if(launch.cores.length > 0) console.log('core', launch.cores[0].core, coresIndex[launch.cores[0].core])
          const payloads = launch.payloads.map(id => payloadsIndex[id]).filter(Boolean);
          return <Launch key={launch.id} {...{ launch, core, payloads }} />
        })}
      </div>
    </div>
  );
}
