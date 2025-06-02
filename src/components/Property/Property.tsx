import styles from './Property.module.css';
import Link from 'next/link';
import { truncateText } from '@/utils/text';
import { formatPrice } from '@/utils/text';
// Types
import { Property as PropertyType } from '@/types';


export default function Property(props: { data: PropertyType }) {
    const { data } = props;
    const thumbnail = data.images?.[0] ?? undefined;
    const transaction = data.transaction === 'sale' ? 'Venta' : 'Renta';

    if (data.description) {
        data.description = truncateText(data.description, 50);
    }

    return (
        <div className={styles.property}>
            <Link href={`/property/${data.id}`}>
                <img src={thumbnail} alt={data.title} className={styles.image} />

                <div className={styles.details}>
                    <h3 className={styles.price}>{formatPrice(data.price)}</h3>
                    <p className={styles.description}>{data.description}</p>
                    <p className={styles.details_info}>
                        <span className={styles.transaction}> {transaction} </span> | {data.bedrooms} Cuartos | {data.bathrooms} {data.bathrooms === 1 ? 'Baño' : 'Baños'}
                    </p>
                </div>
            </Link>
        </div>
    )
}