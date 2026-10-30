// La sezione propria di una pagina (Automazioni «Resti tu a decidere», Siti «E quando serve un'app»): un titolo e un testo oppure un elenco.
export default function Extra({ h2, testo, elenco }: { h2: string; testo?: string; elenco?: string[] }) {
  return (
    <section className="sezione extra" data-modo="extra" aria-labelledby="extra-t">
      <h2 id="extra-t" className="sezione-titolo cresce">{h2}</h2>
      <div className="extra-corpo cresce">
        {testo ? <p className="extra-testo">{testo}</p> : null}
        {elenco ? (
          <ul className="extra-elenco">
            {elenco.map((v) => <li key={v}>{v}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
