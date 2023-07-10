import React from 'react';
import Image from 'next/image';
import * as Types from '../types';
import { format, parseISO } from 'date-fns';
import styles from './Launch.module.css';
import { formatInterval } from '../lib/formatInterval';

interface Props {
  launch: Types.Launch;
  core: Types.Core | null;
  payloads: Types.Payload[];
}

export function Launch({ launch, core, payloads }: Props) {
  return (
    <div className={styles.launch} data-testid="launch">
      <header className={styles.header}>
        <img src={launch.links.patch.small} alt={launch.name} className={styles.image} data-testid="image" />
        <div className={styles.details}>
          <h2 className={styles.name} data-testid="name">{launch.success ? '✅' : '❌'} {launch.name}</h2>
          <p className={styles.date} data-testid="date" title={launch.date_utc}>{format(parseISO(launch.date_utc), 'do LLL yyyy @ h:mmaaa')}</p>
          {core ? (
            <p className={styles.core} data-testid="core"><strong>Primary Core:</strong>{' ' + core.serial}</p>
          ) : null}
        </div>
      </header>
      <div className={styles.listContainer} data-testid="payloads">
        <h3 className={styles.listTitle}>Payload</h3>
        <ol className={styles.list}>
          {payloads.map(p => (
            <li data-testid="payload" key={p.id} className={styles.listItem}>{p.id} <strong>({p.type})</strong></li>
          ))}
        </ol>
      </div>
      {launch.failures.length > 0 ? (
        <div className={`${styles.listContainer} ${styles.failures}`} data-testid="failures">
          <h3 className={styles.listTitle}>Failures</h3>
          <ol className={styles.list}>
            {launch.failures.map(f => (
              <li key={f.time} className={styles.listItem} data-testid="failure">
                <strong>{formatInterval(f.time)}{f.altitude ? (`@${f.altitude}ft`) : ''}:</strong>
                {' ' + f.reason}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}