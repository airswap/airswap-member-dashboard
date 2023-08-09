import { FC, RefObject, useEffect, useState } from "react";
import { Button } from "../common/Button";
import { twJoin } from "tailwind-merge";
import { usePrepareContractWrite, useContractWrite, useContractRead, useBalance } from 'wagmi'
import { contractAddresses } from "../../utils/constants";
import stakingABI from '../../contracts/stakingAbi.json'
import astABI from '../../contracts/astAbi.json'
import { buttonStatusText } from "./uils/buttonStatusText";
// import { encodeFunctionData } from "viem";
import { useForm } from "react-hook-form"
import { format } from "@greypixel_/nicenumbers";
import ManageStake from "./subcomponents/ManageStake";
import { StakeInput, StatusStaking } from "./types/StakingTypes";
import Approving from "./subcomponents/Approving";
import ApproveSuccess from "./subcomponents/ApproveSuccess";

interface StakingModalInterface {
  stakingModalRef: RefObject<HTMLDialogElement>,
  address: string,
  chainId: number
}

const StakingModal: FC<StakingModalInterface> = ({
  stakingModalRef,
  address,
  chainId
}) => {
  const [statusStaking, setStatusStaking] = useState<StatusStaking>("unapproved");

  const {
    register,
    watch,
    setValue,
    getValues,
    // formState: { errors }
  } = useForm<StakeInput>()

  watch();
  const values = getValues();
  const stakingAmount = values.stakingAmount || 0;

  const { data: astBalanceData } = useBalance({
    address: address as `0x${string}`,
    token: contractAddresses[chainId].ast as `0x${string}` || "",
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  });

  const { data: sAstBalanceData } = useContractRead({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    staleTime: 300_000, // 5 minutes,
  })

  const { config: configStake } = usePrepareContractWrite({
    address: contractAddresses[chainId].staking as `0x${string}`,
    abi: stakingABI,
    functionName: 'stake',
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
  })
  const { write: stakeFunction } = useContractWrite(configStake)

  const { data: astAllowanceData } = useContractRead({
    address: contractAddresses[chainId].ast as `0x${string}`,
    abi: astABI,
    functionName: 'allowance',
    args: [address, contractAddresses[chainId].staking],
    watch: true,
    staleTime: 300_000, // 5 minutes,
  })

  const { config: configApprove } = usePrepareContractWrite({
    address: contractAddresses[chainId].ast as `0x${string}`,
    abi: astABI,
    functionName: 'approve',
    staleTime: 300_000, // 5 minutes,
    cacheTime: Infinity,
    args: [contractAddresses[chainId].staking, stakingAmount * Math.pow(10, 4)]
  })
  const {
    write: approveAst,
    isSuccess: isSuccessApprove
  } = useContractWrite(configApprove)

  // convert unformatted balances
  const astAllowance = (astAllowanceData as bigint).toString() || "0";
  const astBalance =
    format(astBalanceData?.value, { tokenDecimals: 4 }).replace("T", "");
  const sAstBalance = (sAstBalanceData as bigint).toString()

  const disableButtonLogic = (statusStaking: string) => {
    if (statusStaking === 'unapproved') {
      return stakingAmount <= 0
    } else if (statusStaking === 'approved') {
      return +astBalance < +astAllowance
    }
  };

  const buttonText = buttonStatusText(statusStaking)

  const buttonAction = () => {
    if (statusStaking === 'unapproved') {
      // setStatusStaking("approving");
      return approveAst && approveAst()
    } else if (statusStaking === 'approved') {
      null
    } else if (statusStaking === 'success') {
      null
    }
  };

  const handleCloseModal = () => {
    stakingModalRef.current && stakingModalRef.current.close()
  }

  useEffect(() => {
    if (isSuccessApprove) {
      setStatusStaking('approved')
      console.log('isSuccessApprove', isSuccessApprove)
    }
  }, [isSuccessApprove, statusStaking])

  console.log('statusStaking', statusStaking)

  return (
    <dialog className={twJoin("content-center bg-black p-4 text-white border border-border-darkGray",
      ['w-fit xs:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/5'])} ref={stakingModalRef}>

      {(statusStaking === 'unapproved' || statusStaking === 'approved') ? (
        <ManageStake
          handleCloseModal={handleCloseModal}
          sAstBalance={sAstBalance}
          astBalance={astBalance}
          register={register}
          setValue={setValue}
        />
      ) : null}

      {statusStaking === 'approving' ? (
        <Approving handleCloseModal={handleCloseModal} />
      ) : null}

      {statusStaking === 'approved' ? (
        <ApproveSuccess
          handleCloseModal={handleCloseModal}
          setStatusStaking={setStatusStaking}
          amountApproved={stakingAmount.toString()}
          transactionHash={'0x'}
        />
      ) : null}

      <Button
        className="rounded-sm w-full uppercase font-semibold bg-accent-blue mt-10 mb-2"
        onClick={buttonAction}
        disabled={disableButtonLogic(statusStaking)}
      >
        {buttonText}
      </Button>
    </dialog>
  )
}

export default StakingModal
