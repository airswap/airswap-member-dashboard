interface StakeBalancesInterface {
  unstakable: string,
  staked: string,
  stakable: string
}

const StakeBalances = ({ unstakable, staked, stakable }: StakeBalancesInterface) => {
  return (
    <>
      <div className="mt-6">
        (PROGRESS BAR)
        {/* TODO: add progress bar here with AST balance */}
      </div>
      <div className="flex flex-row">
        <span className="mr-2">{unstakable}</span>unstakable
      </div>
      <div className="flex flex-row">
        <span className="mr-2">{staked}</span>staked
      </div>
      <div className="flex flex-row">
        <span className="mr-2">{stakable}</span>stakable
      </div>
    </>
  )
}

export default StakeBalances
