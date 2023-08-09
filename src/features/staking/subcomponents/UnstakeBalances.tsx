interface UnstakeBalancesInterface {
  stakedBalance: string
}

const UnstakeBalances = ({ stakedBalance }: UnstakeBalancesInterface) => {
  return (
    <>
      <div className="mt-6">
        (PROGRESS BAR)
        {/* TODO: add progress bar here with AST balance */}
      </div>
      <div className="flex flex-row">
        <span className="mr-2">{stakedBalance}</span>
        <span>stakable</span>
      </div>
    </>
  )
}

export default UnstakeBalances
