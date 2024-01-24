<table className='board'>
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Pays</th>
                                <th>Nom Prénom</th>
                                <th>Best Score</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ranking.length > 0 ? (
                            ranking.map((item: RankingProps, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.user.country}</td>
                                    <td>{item.user.firstname} {item.user.lastname}</td>
                                    <td>{item.best_score}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))) : null}
                        </tbody>
                    </table>