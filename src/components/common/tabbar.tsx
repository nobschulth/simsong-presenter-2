import { useState } from "react"
import styles from "./tabbar.module.css"

export default function Tabbar( props: { default: number, items: string[], onSelected: (id: number) => any } ) {
    const [selected, setSelected] = useState(props.default);

    function onSelected(id: number) {
        if (id >= props.items.length) return;
        setSelected(id);
        props.onSelected(id);
    }

    return (
        <div className={styles.tabbar}>
            {props.items.map((i, index) => (
                <div 
                    onClick={() => onSelected(index)} 
                    key={i} 
                    className={`${styles.tabbarButton} ${selected === index ? styles.tabbarButtonActive : ""}`}>{i}</div>
            ))}
        </div>
    );
}
