import { useState } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"

import { Document, Entity } from "@/lib/google"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const ENTITY_TYPES = {
  CUSTOMER_ORDER_ADDITIONAL_SHIPPER_INFO:
    "customer_order_additional_shipper_info",
  CUSTOMER_ORDER_COD: "customer_order_cod",
  CUSTOMER_ORDER_DESCRIPTION: "customer_order_description",
  CUSTOMER_ORDER_NUMBER: "customer_order_number",
  CUSTOMER_ORDER_PACKAGE_NUMBER: "customer_order_package_number",
  CUSTOMER_ORDER_PACKAGE_TYPE: "customer_order_package_type",
  CUSTOMER_ORDER_TYPE: "customer_order_type",
  CUSTOMER_ORDER_WEIGHT: "customer_order_weight",
  DOCUMENT_DATE: "document_date",
  DOCUMENT_NUMBER: "document_number",
  FREIGHT_BILL_TO_ADDRESS: "freight_bill_to_address",
  FREIGHT_BILL_TO_CITY: "freight_bill_to_city",
  FREIGHT_BILL_TO_COUNTRY: "freight_bill_to_country",
  FREIGHT_BILL_TO_NAME: "freight_bill_to_name",
  FREIGHT_BILL_TO_STATE: "freight_bill_to_state",
  FREIGHT_BILL_TO_ZIP: "freight_bill_to_zip",
  FREIGHT_CARRIER_ALPHA_CODE: "freight_carrier_alpha_code",
  FREIGHT_CARRIER_NAME: "freight_carrier_name",
  FREIGHT_CHARGE_TERMS_COLLECT: "freight_charge_terms_collect",
  SHIP_FROM_ADDRESS: "ship_from_address",
  SHIP_FROM_CITY: "ship_from_city",
  SHIP_FROM_NAME: "ship_from_name",
  SHIP_FROM_SID: "ship_from_sid",
  SHIP_FROM_STATE: "ship_from_state",
  SHIP_FROM_ZIP: "ship_from_zip",
  SHIP_TO_ADDRESS: "ship_to_address",
  SHIP_TO_CID: "ship_to_cid",
  SHIP_TO_CITY: "ship_to_city",
  SHIP_TO_COUNTRY: "ship_to_country",
  SHIP_TO_NAME: "ship_to_name",
  SHIP_TO_STATE: "ship_to_state",
  SHIP_TO_ZIP: "ship_to_zip",
} as const

const cardGroups = [
  {
    title: "Document",
    prefix: "document",
    fields: [ENTITY_TYPES.DOCUMENT_DATE, ENTITY_TYPES.DOCUMENT_NUMBER],
  },
  {
    title: "Order",
    prefix: "customer_order",
    fields: [
      ENTITY_TYPES.CUSTOMER_ORDER_DESCRIPTION,
      ENTITY_TYPES.CUSTOMER_ORDER_NUMBER,
      ENTITY_TYPES.CUSTOMER_ORDER_WEIGHT,
      ENTITY_TYPES.CUSTOMER_ORDER_TYPE,
      ENTITY_TYPES.CUSTOMER_ORDER_PACKAGE_NUMBER,
      ENTITY_TYPES.CUSTOMER_ORDER_PACKAGE_TYPE,
      ENTITY_TYPES.CUSTOMER_ORDER_ADDITIONAL_SHIPPER_INFO,
      ENTITY_TYPES.CUSTOMER_ORDER_COD,
    ],
  },
  {
    title: "Freight",
    prefix: "freight",
    fields: [
      ENTITY_TYPES.FREIGHT_CARRIER_NAME,
      ENTITY_TYPES.FREIGHT_CARRIER_ALPHA_CODE,
      ENTITY_TYPES.FREIGHT_CHARGE_TERMS_COLLECT,
      ENTITY_TYPES.FREIGHT_BILL_TO_NAME,
      ENTITY_TYPES.FREIGHT_BILL_TO_ADDRESS,
      ENTITY_TYPES.FREIGHT_BILL_TO_CITY,
      ENTITY_TYPES.FREIGHT_BILL_TO_STATE,
      ENTITY_TYPES.FREIGHT_BILL_TO_ZIP,
      ENTITY_TYPES.FREIGHT_BILL_TO_COUNTRY,
    ],
  },
  {
    title: "Ship from",
    prefix: "ship_from",
    fields: [
      ENTITY_TYPES.SHIP_FROM_NAME,
      ENTITY_TYPES.SHIP_FROM_ADDRESS,
      ENTITY_TYPES.SHIP_FROM_CITY,
      ENTITY_TYPES.SHIP_FROM_STATE,
      ENTITY_TYPES.SHIP_FROM_ZIP,
      ENTITY_TYPES.SHIP_FROM_SID,
    ],
  },
  {
    title: "Ship to",
    prefix: "ship_to",
    fields: [
      ENTITY_TYPES.SHIP_TO_NAME,
      ENTITY_TYPES.SHIP_TO_ADDRESS,
      ENTITY_TYPES.SHIP_TO_CITY,
      ENTITY_TYPES.SHIP_TO_STATE,
      ENTITY_TYPES.SHIP_TO_ZIP,
      ENTITY_TYPES.SHIP_TO_COUNTRY,
      ENTITY_TYPES.SHIP_TO_CID,
    ],
  },
] as const

type CheckboxRecord = { [x: string]: CheckedState }

interface Props {
  edit: boolean
  data: Document | null
}

export function EntityList(props: Props) {
  const entities = props.data?.entities ?? []

  const [selectedGroups, setSelectedGroups] = useState<CheckboxRecord>(
    cardGroups.reduce((acc, group) => {
      acc[group.prefix] = true
      return acc
    }, {} as CheckboxRecord)
  )

  const [selectedEntities, setSelectedEntities] = useState<CheckboxRecord>(
    entities.reduce((acc, entity) => {
      acc[entity.type] = true
      return acc
    }, {} as CheckboxRecord)
  )

  const entityMap = entities.reduce(
    (acc, entity) => {
      acc[entity.type] = entity
      return acc
    },
    {} as Record<string, Entity>
  )

  return (
    <ul className="grid grid-cols-1 gap-2">
      {cardGroups.map(function (group, index) {
        return (
          <li key={index} className="w-full">
            <Card className="w-full">
              <CardHeader className="relative py-4">
                <label className="flex gap-2">
                  {props.edit && (
                    <Checkbox
                      checked={selectedGroups[group.prefix]}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEntities({
                            ...selectedEntities,
                            ...group.fields.reduce((acc, field) => {
                              acc[field] = true
                              return acc
                            }, {} as CheckboxRecord),
                          })
                        } else {
                          setSelectedEntities({
                            ...selectedEntities,
                            ...group.fields.reduce((acc, field) => {
                              acc[field] = false
                              return acc
                            }, {} as CheckboxRecord),
                          })
                        }
                        setSelectedGroups({
                          ...selectedGroups,
                          [group.prefix]: checked,
                        })
                      }}
                    />
                  )}
                  <CardTitle className="text-sm">{group.title}</CardTitle>
                </label>
              </CardHeader>
              <CardContent
                className={cn(
                  "pt-4",
                  selectedGroups[group.prefix] === false ? "opacity-50" : ""
                )}
              >
                <ul className="grid grid-cols-2 gap-2">
                  {group.fields.map(function (field) {
                    return (
                      <li key={field}>
                        <label className="flex gap-2">
                          {props.edit && (
                            <Checkbox
                              checked={selectedEntities[field]}
                              onCheckedChange={(checked) => {
                                setSelectedEntities({
                                  ...selectedEntities,
                                  [field]: checked,
                                })
                              }}
                            />
                          )}
                          <div className="flex flex-col">
                            <h2 className="order-2 break-words font-mono text-xs text-muted-foreground">
                              {field
                                .split(group.prefix + "_")[1]
                                .replace(/_/g, " ")}
                            </h2>
                            <p
                              className={cn(
                                "order-1 break-words text-sm font-medium",
                                selectedEntities[field] === false
                                  ? "opacity-50"
                                  : ""
                              )}
                            >
                              {entityMap[field].mentionText}
                            </p>
                          </div>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
