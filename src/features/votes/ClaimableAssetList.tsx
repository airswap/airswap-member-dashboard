import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSplitsAmounts } from "../../hooks/useSplitsAmounts";
import { formatNumber } from "../common/utils/formatNumber";

export const ClaimableAssetList = ({ }: {}) => {

  let splitsAmountsResults = useSplitsAmounts();
  const max = splitsAmountsResults[0].data?.totalUsdValue || 0;

  return (
    <div className="flex flex-col gap-4 p-4 relative flex-1">
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-xs font-bold uppercase text-gray-500">
          Dashboard
        </h3>
        <div className="h-px flex-1 bg-gray-800"></div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={splitsAmountsResults.length * 30}>
          <BarChart layout="vertical" data={splitsAmountsResults.map((result) => result.data)}>
            <Legend verticalAlign="top" />
            <Bar name="To distribute" dataKey="toDistributeUsdValue" stackId="a" fill="#ffc658" />
            <Bar name="To withdraw" dataKey="toWithdrawUsdValue" stackId="a" fill="#82ca9d" />
            <Bar name="Pool" dataKey="claimableUsdValue" stackId="a" fill="#8884d8">
              <LabelList dataKey="totalUsdValue" position="insideRight" formatter={formatAmount} className="fill-white opacity-75 text-sm" />
            </Bar>
            <Tooltip cursor={false} content={<CustomTooltip />} wrapperClassName="shadow shadow-xl" formatter={formatAmount} />
            <XAxis type="number" hide={true} domain={[0, max]} />
            <YAxis type="category" dataKey="tokenInfo.symbol" interval={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 rounded-md border border-gray-800">
        <table>
          <thead>
            <tr className="text-left">
              <th className="px-2 w-32 border-r border-gray-800">{label}</th>
              <th className="px-2 border-r border-gray-800">Amount</th>
              <th className="px-2">USD value</th>
            </tr>
          </thead>
          <tbody className="text-gray-500">
            <tr className="border-t border-gray-800">
              <td className="px-2 font-semibold" style={{ color: payload[0].color }}>{payload[0].name}</td>
              <td className="px-2 border-r border-gray-800">{formatNumber(payload[0].payload.toDistribute)}</td>
              <td className="px-2 text-right tabular-nums">{formatAmount(payload[0].value)}</td>
            </tr>
            <tr className="border-t border-gray-800">
              <td className="px-2 border-r border-gray-800 font-semibold" style={{ color: payload[1].color }}>{payload[1].name}</td>
              <td className="px-2 border-r border-gray-800">{formatNumber(payload[1].payload.toWithdraw)}</td>
              <td className="px-2 text-right tabular-nums">{formatAmount(payload[1].value)}</td>
            </tr>
            <tr className="border-t border-gray-800">
              <td className="px-2 border-r border-gray-800 font-semibold" style={{ color: payload[2].color }}>{payload[2].name}</td>
              <td className="px-2 border-r border-gray-800">{formatNumber(payload[2].payload.claimable)}</td>
              <td className="px-2 text-right tabular-nums">{formatAmount(payload[2].value)}</td>
            </tr>
            <tr className="border-t border-gray-800">
              <td className="px-2 text-white border-r border-gray-800 font-semibold">Total</td>
              <td className="px-2 border-r border-gray-800">{formatNumber(payload[0].payload.total)}</td>
              <td className="px-2 text-right tabular-nums">{formatAmount(payload[0].payload.totalUsdValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

const formatAmount = (amount: number): string => {
  return "$" + amount.toFixed(2);
}