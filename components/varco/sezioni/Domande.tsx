// Le domande (DESIGN_SPEC-pagine §8.8): <details> e <summary> veri, apribili da tastiera, chiusi di partenza. Nessuna mascotte.
export default function Domande({ h2, voci }: { h2: string; voci: { d: string; r: string }[] }) {
  return (
    <section className="sezione domande" data-modo="domande" aria-labelledby="domande-t">
      <h2 id="domande-t" className="sezione-titolo cresce">{h2}</h2>
      <div className="domande-lista cresce">
        {voci.map((v) => (
          <details className="domanda" key={v.d}>
            <summary className="domanda-d">
              <span>{v.d}</span>
              <span className="domanda-piu" aria-hidden="true" />
            </summary>
            <p className="domanda-r">{v.r}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
