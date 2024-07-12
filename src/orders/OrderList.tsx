import * as React from 'react'
import { Fragment, useCallback } from 'react'
import {
  AutocompleteInput,
  BooleanField,
  Count,
  DatagridConfigurable,
  DateField,
  DateInput,
  ExportButton,
  FilterButton,
  List,
  NullableBooleanInput,
  NumberField,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
} from 'react-admin'
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material'

import NbItemsField from './NbItemsField'
import UserReferenceField from '../visitors/UserReferenceField'
import AddressField from '../visitors/AddressField'
import MobileGrid from './MobileGrid'
import { User } from '../types'

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <ExportButton />
  </TopToolbar>
)

const OrderList = () => (
  <List
    filterDefaultValues={{ status: 'ordered' }}
    sort={{ field: 'date', order: 'DESC' }}
    perPage={25}
    filters={orderFilters}
    actions={<ListActions />}
  >
    <TabbedDatagrid />
  </List>
)

const orderFilters = [
  <SearchInput source="q" alwaysOn />,
  <ReferenceInput source="user_id" reference="api/v1/user/admin">
    <AutocompleteInput
      optionText={(choice?: User) =>
        choice?.id // the empty choice is { id: '' }
          ? `${choice.first_name} ${choice.last_name}`
          : ''
      }
      sx={{ minWidth: 200 }}
    />
  </ReferenceInput>,
  <DateInput source="date_gte" />,
  <DateInput source="date_lte" />,
  <TextInput source="total_gte" />,
  <NullableBooleanInput source="returned" />,
]

const tabs = [
  { id: 'ordered', name: 'ordered' },
  { id: 'delivered', name: 'delivered' },
  { id: 'cancelled', name: 'cancelled' },
]

const TabbedDatagrid = () => {
  const listContext = useListContext()
  const { filterValues, setFilters, displayedFilters } = listContext
  const isXSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, value: any) => {
      setFilters &&
        setFilters(
          { ...filterValues, status: value },
          displayedFilters,
          false, // no debounce, we want the filter to fire immediately
        )
    },
    [displayedFilters, filterValues, setFilters],
  )

  return (
    <Fragment>
      <Tabs
        variant="fullWidth"
        centered
        value={filterValues.status}
        indicatorColor="primary"
        onChange={handleChange}
      >
        {tabs.map((choice) => (
          <Tab
            key={choice.id}
            label={
              <span>
                {choice.name} (
                <Count
                  filter={{
                    ...filterValues,
                    status: choice.name,
                  }}
                  sx={{ lineHeight: 'inherit' }}
                />
                )
              </span>
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider />
      {isXSmall ? (
        <MobileGrid />
      ) : (
        <>
          {filterValues.status === 'ordered' && (
            <DatagridConfigurable
              rowClick="edit"
              omit={['total_ex_taxes', 'taxes']}
            >
              <DateField source="created_at" showTime />
              <TextField source="reference" />
              <UserReferenceField />
              <ReferenceField
                source="address_id"
                reference="api/v1/address/admin"
                link={false}
                label="resources.sales.fields.address"
              >
                <AddressField />
              </ReferenceField>
              <NbItemsField />
              <NumberField
                source="total_ex_taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="total"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
                sx={{ fontWeight: 'bold' }}
              />
            </DatagridConfigurable>
          )}
          {filterValues.status === 'delivered' && (
            <DatagridConfigurable
              rowClick="edit"
              omit={['total_ex_taxes', 'taxes']}
            >
              <DateField source="created_at" showTime />
              <TextField source="reference" />
              <UserReferenceField />
              <ReferenceField
                source="address_id"
                reference="api/v1/address/admin"
                link={false}
                label="resources.sales.fields.address"
              >
                <AddressField />
              </ReferenceField>
              <NbItemsField />
              <NumberField
                source="total_ex_taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="total"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
                sx={{ fontWeight: 'bold' }}
              />
              <BooleanField source="returned" sx={{ mt: -0.5, mb: -0.5 }} />
            </DatagridConfigurable>
          )}
          {filterValues.status === 'cancelled' && (
            <DatagridConfigurable
              rowClick="edit"
              omit={['total_ex_taxes', 'taxes']}
            >
              <DateField source="created_at" showTime />
              <TextField source="reference" />
              <UserReferenceField />
              <ReferenceField
                source="address_id"
                reference="api/v1/address/admin"
                link={false}
                label="resources.sales.fields.address"
              >
                <AddressField />
              </ReferenceField>
              <NbItemsField />
              <NumberField
                source="total_ex_taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="taxes"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
              />
              <NumberField
                source="total"
                options={{
                  style: 'currency',
                  currency: 'USD',
                }}
                sx={{ fontWeight: 'bold' }}
              />
            </DatagridConfigurable>
          )}
        </>
      )}
    </Fragment>
  )
}

export default OrderList
